import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash-lite")
prompt = "You are Projectra AI. Build me a Netflix clone."
response = model.generate_content(
    prompt,
    generation_config=genai.types.GenerationConfig(
        max_output_tokens=1000,
        temperature=0.7,
    )
)
print("FINISH REASON:", response.candidates[0].finish_reason)
print("TEXT:\n", response.text)
