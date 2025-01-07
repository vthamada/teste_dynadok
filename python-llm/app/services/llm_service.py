import os
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        # Aqui assumimos que há uma variável de ambiente HF_TOKEN configurada.
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, lang: str) -> str:
        # Adiciona o idioma ao prompt
        prompt = (
            f"Resuma o seguinte texto em {lang} em no máximo 3 frases, "
            f"preservando apenas as informações mais importantes:\n\n{text}"
        )

        # Faz a chamada ao modelo
        response = self.llm.invoke(prompt)

        return response.strip()
