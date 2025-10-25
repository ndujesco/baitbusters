from fastapi import FastAPI
from pydantic import BaseModel
from typing import Any, Dict, Optional
import json
from ai_model import probPhishing


app = FastAPI()

def check_spam_status(message) -> float:
    probability , prediction = probPhishing(message)
    prob = probability[0][1]
    if prob > 0.8:
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
        parsed = json.loads(trimmed.replace("'", '"'))
        print(parsed)
    except Exception:
        print("Not parsed")
        return {"reply": "-1"}

    # Must be a dict with id and body
    if not isinstance(parsed, dict):
        return {"reply": "-1"}

    msg_id = parsed.get("id")
    body = parsed.get("body")

    if not isinstance(msg_id, (str, int)) or not isinstance(body, str):
        return {"reply": "-1"}

    msg_id_str = str(msg_id)

    # Call your spam checker (DO NOT rewrite it here)
    try:
        spam_status = check_spam_status(body)
    except Exception:
        return {"reply": "-1"}

    # Return a string reply that contains a JSON object with id and spam_status
    # Example reply: '{"id":"abc","spam_status":"1"}'
    try:
        reply_payload = json.dumps({"id": msg_id_str, "spam_status": str(spam_status)})
    except Exception:
        return {"reply": "-1"}

    return {"reply": reply_payload}





