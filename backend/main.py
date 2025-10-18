from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define expected request body
class Message(BaseModel):
    message: str

@app.post("/predict")
async def predict(data: Message):
    # Access message directly
    reply = f"Received: {data.message}. (This is a dummy AI response)"
    return {"reply": reply}
