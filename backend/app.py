from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "allow_headers": ["Content-Type"],
    "expose_headers": ["Content-Type"],
    "supports_credentials": False
}})

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPTS = {
  "normal": """You are Projectra AI, a futuristic AI developer 
assistant for engineering students and beginners. Help users generate 
project ideas, create development roadmaps, recommend tech stacks, 
and plan hackathon MVPs. Generate structured response with Project 
Overview, Frontend, Backend, Database, APIs, Development Phases, 
Deployment, Future scope. Use markdown. Keep under 400 words.""",

  "hackathon": """You are Projectra AI in HACKATHON MODE. User has 
12-48 hours to build an MVP. Suggest fastest tech stack. List only 
core MVP features max 3-5. List what to SKIP. Give time breakdown. 
Format: MVP Features, Skip These, Stack, Deploy, Timeline. 
Under 300 words.""",

  "beginner": """You are Projectra AI in BEGINNER MODE. Use simple 
friendly language. Break into numbered steps. Explain WHY each 
technology is chosen. Suggest beginner-friendly tools only. 
Include How to start today section. Under 400 words.""",

  "stack": """You are Projectra AI in TECH STACK ADVISOR mode. 
Recommend Frontend, Backend, Database, Deployment with pros and cons. 
Give clear final recommendation. Use comparison tables. 
Under 400 words."""
}

@app.route("/api/health")
def health():
    return {"status": "ok"}

@app.route("/api/ping")
def ping():
    return {"status": "alive"}

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        mode = data.get("mode", "normal")
        system_prompt = SYSTEM_PROMPTS.get(
            mode, SYSTEM_PROMPTS["normal"]
        )
        full_prompt = f"{system_prompt}\n\nUser: {user_message}"

        response = client.models.generate_content(
            model="gemini-1.5-flash-002",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=800,
                temperature=0.7,
            )
        )

        return jsonify({
            "response": response.text,
            "status": "success"
        })

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({
            "response": "Something went wrong. Please try again.",
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, threaded=True)
