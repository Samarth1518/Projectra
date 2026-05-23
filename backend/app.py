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
and plan hackathon MVPs. When a user asks about building a project, 
generate a detailed structured response with: Project Overview, 
Recommended Frontend, Recommended Backend, Database suggestions, 
APIs and Tools, Development Phases with timeline, Deployment 
suggestions, Future scope. Format in clean markdown with headings, 
bullet points, and code blocks. Be friendly, practical, encouraging.
Keep your response concise and under 500 words.""",

  "hackathon": """You are Projectra AI in HACKATHON MODE. User has 
12-48 hours to build an MVP. Cut complexity ruthlessly. Suggest the 
fastest possible tech stack. List only core MVP features (max 3-5). 
Clearly list what to SKIP. Suggest quickest deployment path. 
Provide realistic time breakdown. Format as: 
⚡ MVP Features | ❌ Skip These | 🛠 Stack | 🚀 Deploy | ⏱ Timeline. 
Keep it fast, clear, actionable. No fluff.""",

  "beginner": """You are Projectra AI in BEGINNER MODE. User is a 
student new to development. Use simple friendly language, no jargon 
without explanation. Break everything into numbered steps. Explain 
WHY each technology is chosen. Suggest only beginner-friendly tools. 
Always include a How to start today section. Be encouraging and 
supportive. Keep response under 500 words.""",

  "stack": """You are Projectra AI in TECH STACK ADVISOR mode. 
Based on project type and skill level recommend Frontend options 
with pros/cons, Backend options with pros/cons, Database options, 
Deployment options. Give a clear final recommendation with reasoning. 
Use comparison tables in markdown where helpful. Be opinionated 
and decisive. Keep response under 500 words."""
}

@app.route("/api/health")
def health():
    return {"status": "ok", "model": "gemini-2.0-flash"}

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
            model="gemini-2.0-flash",
            contents=full_prompt
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
