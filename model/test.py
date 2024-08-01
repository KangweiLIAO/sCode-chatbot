from transformers import AutoModel, AutoTokenizer

checkpoint = "Salesforce/codet5p-220m-bimodal"
device = "cuda"  # for GPU usage or "cpu" for CPU usage

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModel.from_pretrained(checkpoint, trust_remote_code=True).to(device)

text = """How to print Hello in python?"""
print("Input:", text)

inputs = tokenizer.encode(text, return_tensors="pt").to(device)
outputs = model.generate(inputs, max_length=128)

print("Output:\n", tokenizer.decode(outputs[0], skip_special_tokens=True))


# import requests
#
# API_TOKEN = "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"
#
# API_URL = "https://api-inference.huggingface.co/models/google/gemma-7b"
# headers = {"Authorization": f"Bearer {API_TOKEN}"}
#
#
# def query(payload):
#     response = requests.post(API_URL, headers=headers, json=payload)
#     return response.json()
#
#
# output = query({"inputs": "How to print 'Hello' in Python? Here's the code:"})
# print(output)
