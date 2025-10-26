from fastapi import FastAPI
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Any, Dict, Optional
import json
from ai_model import probPhishing
import requests


load_dotenv()

GOOGLE_TRANSLATE_API_KEY = os.getenv("GOOGLE_TRANSLATE_API_KEY", "")


app = FastAPI()

def translate_text(text):
    url = "https://translation.googleapis.com/language/translate/v2"
    params = {
        "key": GOOGLE_TRANSLATE_API_KEY
    }
    body = {
        "q": text,      # text to translate
        "target": "en", # target language
    }
    print(GOOGLE_TRANSLATE_API_KEY)
    response = requests.post(url, params=params, json=body)
    data = response.json()

    return data['data']['translations'][0]['translatedText']


def check_spam_status(message) -> float:
    probability , prediction = probPhishing(message)
    prob = probability[0][1]
    print(f"Probability of phishing: {prob}")
    if prob > 0.95:
        return 1
    else:
        return 0.0

class Message(BaseModel):
    message: Any  # will be a JSON string like '{"id":"abc","body":"..."}'

@app.post("/predict")
async def predict(data: Message):
    raw = data.message

    # Expect a string which itself is JSON ({"id": "...", "body": "..."})
    if not isinstance(raw, str):
        print("Not even a string!")
        return {"reply": "-1"}

    trimmed = raw.strip()
    # Try to parse the inner JSON string
    try:
        print("trimmed: ", trimmed)
        parsed = json.loads(trimmed.replace("'", '"'))
    except Exception:
        print("Not parsed")
        return {"reply": "-1"}

    # Must be a dict with id and body
    if not isinstance(parsed, dict):
        print("Not a dict")
        return {"reply": "-1"}

    msg_id = parsed.get("id")
    body = parsed.get("body")

    if not isinstance(msg_id, (str, int)) or not isinstance(body, str):
        print("Invalid id or body")
        return {"reply": "-1"}

    msg_id_str = str(msg_id)

    # Call your spam checker (DO NOT rewrite it here)
    try:
        translated_text = translate_text(body)
        print("Translated Text:", translated_text)
        spam_status = check_spam_status(translated_text)
    except Exception:
        print("Error during spam check")
        return {"reply": "-1"}

    # Return a string reply that contains a JSON object with id and spam_status
    # Example reply: '{"id":"abc","spam_status":"1"}'
    try:
        reply_payload = json.dumps({"id": msg_id_str, "spam_status": str(spam_status)})
    except Exception:
        return {"reply": "-1"}

    return {"reply": reply_payload}





