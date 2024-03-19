from transformers import AutoModelForQuestionAnswering, AutoTokenizer, Trainer, TrainingArguments, default_data_collator
from datasets import load_dataset, DatasetDict
import torch

model = AutoModelForQuestionAnswering.from_pretrained('deepset/tinyroberta-squad2')
tokenizer = AutoTokenizer.from_pretrained('deepset/tinyroberta-squad2')


def preprocess_function(examples):
    # Combine 'title' and 'answer' to form the context for each example
    contexts = [title + " " + answer for title, answer in zip(examples['title'], examples['answer'])]
    questions = examples['question']

    # Tokenize the question-context pairs
    # Ensure return_offsets_mapping=True for generating offset mappings
    tokenized_examples = tokenizer(questions, contexts, truncation=True, padding="max_length", max_length=512,
                                   return_offsets_mapping=True)

    start_positions = []
    end_positions = []

    for i, (context, answer) in enumerate(zip(contexts, examples['answer'])):
        start_char = context.index(answer)
        end_char = start_char + len(answer)

        # Find the start and end of the answer in the tokenized context
        start_token = tokenized_examples.char_to_token(i, start_char, sequence_index=1)
        end_token = tokenized_examples.char_to_token(i, end_char - 1, sequence_index=1)

        # Model needs answer positions in the context
        start_positions.append(start_token if start_token is not None else 0)
        end_positions.append(end_token if end_token is not None else 0)

    tokenized_examples["start_positions"] = start_positions
    tokenized_examples["end_positions"] = end_positions

    # Remove offset_mapping to avoid errors during training
    del tokenized_examples["offset_mapping"]
    return tokenized_examples


if torch.cuda.is_available():
    print(f"GPU is available: {torch.cuda.get_device_name(0)}")

    # Load the dataset from a CSV file
    dataset = load_dataset("KonradSzafer/stackoverflow_python_preprocessed")

    # Apply the preprocessing function
    tokenized_datasets = dataset.map(preprocess_function, batched=True)
    split = tokenized_datasets['train'].train_test_split(test_size=0.1)  # Adjust the test_size as needed

    # Creating a DatasetDict to hold the splits for convenience
    dataset_split = DatasetDict({
        'train': split['train'],
        'test': split['test']
    })

    # Split the dataset into training and validation sets
    train_dataset = dataset_split["train"].shuffle(seed=42).select(range(1000))  # Example subset for training
    eval_dataset = dataset_split["test"].shuffle(seed=42).select(range(200))  # Example subset for evaluation

    # Define training arguments
    training_args = TrainingArguments(
        output_dir="./results",  # output directory for checkpoints and predictions
        num_train_epochs=30,  # total number of training epochs
        per_device_train_batch_size=20,  # batch size per device during training
        warmup_steps=500,  # number of warmup steps for learning rate scheduler
        weight_decay=0.01,  # strength of weight decay normalization
        logging_dir="./logs",  # directory for storing logs
        logging_strategy="epoch",  # log training information every epoch
        evaluation_strategy="epoch",  # evaluate model every epoch
        save_strategy="epoch",  # save checkpoints every `logging_steps` steps
        save_total_limit=3,  # only keep the 2 most recent checkpoints
    )

    # Initialize the Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=default_data_collator,
        tokenizer=tokenizer,
    )

    # Train the model
    trainer.train()
    trainer.save_model("./model")  # Save the trained model

    # Evaluate the model
    eval_dict = trainer.evaluate()
    # Save the evaluation results
    with open("evaluation.txt", "w") as f:
        f.write(str(eval_dict))
else:
    print("GPU is not available.")
