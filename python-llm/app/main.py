import sys
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str

@app.get("/")
def root():
    return {"message": "API is running"}

@app.post("/summarize")
def summarize(data: TextData):
    supported_languages = ["pt", "en", "es"]
    if data.lang not in supported_languages:
        raise HTTPException(status_code=400, detail="Language not supported")

    # Chama o serviço de resumo
    summary = llm_service.summarize_text(data.text, data.lang)

    return {"summary": summary}
