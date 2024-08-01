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

# Dialogflow parameters:
# project_id = "scode-chatbot-418101"
# location = "us-central1"
# agent_id = "13d35f11-b74c-4dd9-8656-01e997795690"

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserMessage(BaseModel):
    id: int
    text: str
    sender: str


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/test")
async def read_messages():
    """
    Create a dummy response message
    :return:
    """
    return [{"id": current_timestamp_ms, "text": "Hello, I'm sCode Chatbot!", "sender": "bot"}]


@app.post("/test")
async def create_message(message: UserMessage):
    """
    Create a dummy message
    :param message:
    :return:
    """
    response = {
        "id": current_timestamp_ms,  # Increment ID for simplicity
        "text": "This is a response from backend, received: " + message.text,
        "sender": "bot"
    }
    return response


@app.post("/dialogflow")
async def send_message(message: UserMessage):
    """
    Send message to Dialogflow and get response
    :param message:
    :return:
    """
    print("Sending message to Dialogflow...")
    project_id = "scode-chatbot-418101"
    location_id = "us-central1"
    agent_id = "13d35f11-b74c-4dd9-8656-01e997795690"
    language_code = "en-us"

    agent = f"projects/{project_id}/locations/{location_id}/agents/{agent_id}"
    session_id = uuid.uuid4()
    input_text = [message.text]

    response = await detect_and_respond(agent, session_id, input_text, language_code)
    return {"id": message.id + 1, "text": response, "sender": "bot"}


async def detect_and_respond(agent, session_id, texts: List[str], language_code):
    """
    Detect intent from the text and get response from HF model
    :param agent:
    :param session_id:
    :param texts:
    :param language_code:
    :return:
    """
    print("Detecting intent...")
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
        if intent_name == '':
            res_text = await get_model_response(text)
        elif "code_query" in intent_name:
            res_text = await get_model_response(text, True)
        else:
            for msg in response.query_result.response_messages:
                if msg.text.text:
                    res_text.append(' '.join(msg.text.text))
    return res_text


async def get_model_response(q_text: str, is_query=False):
    """
    Get response from Hugging Face model
    :param q_text:
    :param is_query:
    :return:
    """
    print("Getting model response...")
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    prompts = ("Given the context and type of question, craft an appropriate response as follows: "
               "If asked about well-being, respond warmly and concisely. For direct questions, provide brief, "
               "direct answers or instructions. For complex inquiries or problems, offer a clear, step-by-step "
               "explanation or solution. ")
    inputs = prompts + "Example input: '" + q_text + "'"

    payload = {
        "inputs": inputs,
        "parameters": {
            "top_p": 0.8,
            "temperature": 0.2,
            "max_length": 320,
            "repetition_penalty": 1.2,
            "return_full_text": False,
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(f"https://api-inference.huggingface.co/models/{MODEL_URL}",
                                     json=payload, headers=headers)
        print("Response status code:", response.status_code)
        if response.status_code == 200:
            print("Generated response: " + response.json()[0]["generated_text"][2:30] + "...")
            return response.json()[0]["generated_text"].replace('\n', ' ').strip()
        else:
            raise HTTPException(status_code=response.status_code, detail="Error calling Hugging Face API")
