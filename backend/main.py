import os
import json
import base64
import uuid
import httpx

from typing import List
from datetime import datetime

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from google.oauth2 import service_account
from google.cloud.dialogflowcx_v3.services.agents import AgentsClient
from google.cloud.dialogflowcx_v3.services.sessions import SessionsClient
from google.cloud.dialogflowcx_v3.types.session import TextInput, QueryInput, DetectIntentRequest

app = FastAPI()

current_timestamp_ms = int(datetime.now().timestamp() * 1000)

# Decode environment variable into the service account key
credentials_b64 = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')

if credentials_b64 is not None:  # If not running locally, use the service account key file
    credentials_json = base64.b64decode(credentials_b64)
    service_account_info = json.loads(credentials_json)
    google_credential = service_account.Credentials.from_service_account_info(service_account_info)

API_TOKEN = "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"
MODEL_URL = "google/gemma-7b"

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


class UserMessage(BaseModel):
    id: int
    text: str
    sender: str


@app.get("/")
def read_root():
    return [{"id": current_timestamp_ms, "text": "Hello, I'm sCode Chatbot!", "sender": "bot"}]


@app.get("/test")
async def read_messages():
    return [{"id": current_timestamp_ms, "text": "Hello, I'm sCode Chatbot!", "sender": "bot"}]


@app.post("/test")
async def create_message(message: UserMessage):
    response = {
        "id": current_timestamp_ms,  # Increment ID for simplicity
        "text": "This is a response from the bot, I received: " + message.text,
        "sender": "bot"
    }
    return response


# project_id = "scode-chatbot-418101"
# location = "us-central1"
# agent_id = "13d35f11-b74c-4dd9-8656-01e997795690"

@app.post("/dialogflow")
async def send_message(message: UserMessage):
    project_id = "scode-chatbot-418101"
    location_id = "us-central1"
    agent_id = "13d35f11-b74c-4dd9-8656-01e997795690"
    language_code = "en-us"

    agent = f"projects/{project_id}/locations/{location_id}/agents/{agent_id}"
    session_id = uuid.uuid4()
    input_text = [message.text]

    response = await detect_intent_texts(agent, session_id, input_text, language_code)
    return {"id": message.id + 1, "text": response, "sender": "bot"}


async def detect_intent_texts(agent, session_id, texts: List[str], language_code):
    session_path = f"{agent}/sessions/{session_id}"
    client_options = None
    agent_components = AgentsClient.parse_agent_path(agent)
    location_id = agent_components["location"]
    if location_id != "global":
        api_endpoint = f"{location_id}-dialogflow.googleapis.com:443"
        client_options = {"api_endpoint": api_endpoint}

    if credentials_b64 is not None:
        session_client = SessionsClient(credentials=google_credential, client_options=client_options)
    else:
        session_client = SessionsClient(client_options=client_options)

    res_text = []  # list of responses
    for text in texts:
        text_input = TextInput(text=text)
        query_input = QueryInput(text=text_input, language_code=language_code)
        request = DetectIntentRequest(
            session=session_path, query_input=query_input
        )
        response = session_client.detect_intent(request=request)
        intent_name = response.query_result.intent.display_name
        print(f"Detected intent: {intent_name}")
        if ("code_query" in intent_name):
            res_text = await get_code_response(text)
        else:
            for msg in response.query_result.response_messages:
                # join text segments to a single string
                if msg.text.text:
                    res_text.append(" ".join(msg.text.text))
    return res_text


async def get_code_response(q_text: str):
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    payload = {"inputs": q_text, "parameters": {
        "temperature": 0.45,
        "return_full_text": False,
    }}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"https://api-inference.huggingface.co/models/{MODEL_URL}",
                                     json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()[0]["generated_text"]
        else:
            raise HTTPException(status_code=response.status_code, detail="Error calling Hugging Face API")
