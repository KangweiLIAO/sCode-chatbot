from transformers import T5ForConditionalGeneration, AutoTokenizer

checkpoint = "Salesforce/codet5p-220m-bimodal"
device = "cuda"  # for GPU usage or "cpu" for CPU usage

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = T5ForConditionalGeneration.from_pretrained(checkpoint).to(device)

text = """How to find the palindrome of a string?"""
print("Input:", text)

inputs = tokenizer.encode(text, return_tensors="pt").to(device)
outputs = model.generate(inputs, max_length=128)

print("Output:\n", tokenizer.decode(outputs[0], skip_special_tokens=True))
