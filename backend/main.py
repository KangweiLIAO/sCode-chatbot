from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# list of allowed origins for CORS
origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    id: int
    text: str
    sender: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/msg")
async def read_messages():
    return [{"id": 1, "text": "Hello from FastAPI!", "sender": "bot"}]


@app.post("/msg")
async def create_message(message: Message):
    response = {
        "id": message.id + 1,  # Increment ID for simplicity
        "text": "This is a response from the bot, I received: " + message.text,
        "sender": "bot"
    }
    return response
