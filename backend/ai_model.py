import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

#model_path = "C:/Users/USER/Downloads/phishing-detector-model/phishing-detector-model"  

model_path = "DevZr0/phishing-detector"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

def probPhishing(text):
    inputs = tokenizer(
    text,
    return_tensors="pt", 
    truncation=True,
    padding=True,
    max_length=128)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    return (torch.nn.functional.softmax(logits), predicted_class)
