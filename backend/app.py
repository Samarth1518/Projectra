from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
app = Flask(__name__)
from flask_cors import CORS
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "allow_headers": ["Content-Type"],
    "expose_headers": ["Content-Type"],
    "supports_credentials": False
}})

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPTS = {
  "normal": """You are Projectra AI, a futuristic AI developer 
assistant for engineering students and beginners. Help users generate 
project ideas, create development roadmaps, recommend tech stacks, 
and plan hackathon MVPs. When a user asks about building a project, 
generate a detailed structured response with: Project Overview, 
Recommended Frontend, Recommended Backend, Database suggestions, 
APIs and Tools, Development Phases with timeline, Deployment 
suggestions, Future scope. Format in clean markdown with headings, 
bullet points, and code blocks. Be friendly, practical, encouraging. Keep your response concise and under 400 words. Use clear headings and bullet points.""",

  "hackathon": """You are Projectra AI in HACKATHON MODE. User has 
12-48 hours to build an MVP. Cut complexity ruthlessly. Suggest the 
fastest possible tech stack. List only core MVP features (max 3-5). 
Clearly list what to SKIP. Suggest quickest deployment path. 
Provide realistic time breakdown. Format as: 
⚡ MVP Features | ❌ Skip These | 🛠 Stack | 🚀 Deploy | ⏱ Timeline. 
Keep it fast, clear, actionable. No fluff. Keep your response concise and under 400 words. Use clear headings and bullet points.""",

  "beginner": """You are Projectra AI in BEGINNER MODE. User is a 
student new to development. Use simple friendly language, no jargon 
without explanation. Break everything into numbered steps. Explain 
WHY each technology is chosen. Suggest only beginner-friendly tools. 
Always include a How to start today section. Be encouraging and 
supportive. Keep your response concise and under 400 words. Use clear headings and bullet points.""",

  "stack": """You are Projectra AI in TECH STACK ADVISOR mode. 
Based on project type and skill level recommend Frontend options 
with pros/cons, Backend options with pros/cons, Database options, 
Deployment options. Give a clear final recommendation with reasoning. 
Use comparison tables in markdown where helpful. Be opinionated 
and decisive. Keep your response concise and under 400 words. Use clear headings and bullet points."""
}

@app.route("/api/health")
def health():
    return {"status": "ok", "model": "gemini-2.0-flash-lite"}

@app.route("/api/ping")
def ping():
    return {"status": "alive"}

@app.route("/api/test-stream")
def test_stream():
    def generate():
        import time
        words = ["Hello", " from", " Projectra", " AI!", 
                 " Streaming", " works!"]
        for word in words:
            yield f"data: {word}\n\n"
            time.sleep(0.3)
        yield "data: [DONE]\n\n"
    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    mode = data.get("mode", "normal")
    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["normal"])
    full_prompt = f"{system_prompt}\n\nUser: {user_message}"

    def generate():
        import time
        try:
            model = genai.GenerativeModel("gemini-2.0-flash-lite")
            response = model.generate_content(
                full_prompt,
                stream=True,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=800,
                    temperature=0.7,
                )
            )
            for chunk in response:
                if chunk.text:
                    words = chunk.text.split(' ')
                    for i, word in enumerate(words):
                        if i < len(words) - 1:
                            text = (word + ' ').replace("\n", "\\n")
                        else:
                            text = word.replace("\n", "\\n")
                        if text.strip() or text == ' ' or text == "\\n":
                            yield f"data: {text}\n\n"
                            time.sleep(0.03)
            yield "data: [DONE]\n\n"
        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e):
                print("429 error caught, falling back to gemini-flash-latest...")
                try:
                    fallback_model = genai.GenerativeModel("gemini-flash-latest")
                    fallback_response = fallback_model.generate_content(
                        full_prompt,
                        stream=True,
                        generation_config=genai.types.GenerationConfig(
                            max_output_tokens=800,
                            temperature=0.7,
                        )
                    )
                    for chunk in fallback_response:
                        if chunk.text:
                            words = chunk.text.split(' ')
                            for i, word in enumerate(words):
                                if i < len(words) - 1:
                                    text = (word + ' ').replace("\n", "\\n")
                                else:
                                    text = word.replace("\n", "\\n")
                                if text.strip() or text == ' ' or text == "\\n":
                                    yield f"data: {text}\n\n"
                                    time.sleep(0.03)
                    yield "data: [DONE]\n\n"
                except Exception as fallback_e:
                    print(f"ERROR IN FALLBACK: {str(fallback_e)}")
                    yield f"data: [ERROR] {str(fallback_e)}\n\n"
                    yield "data: [DONE]\n\n"
            else:
                print(f"ERROR GENERATING CONTENT: {str(e)}")
                yield f"data: [ERROR] {str(e)}\n\n"
                yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*"
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000, threaded=True)

