# Projectra AI

> From idea to deployment.

## 🌐 Live Demo
**[https://projectra-nu.vercel.app](https://projectra-nu.vercel.app)**

## 📌 About
Projectra AI is a Gemini-powered AI developer assistant 
built for engineering students, hackathon participants, 
and beginners. Get complete project roadmaps, tech stack 
recommendations, and hackathon MVP plans — instantly.

Built for the **GDG PESCE Mandya — Build Your Own Chatbot** challenge.

## ✨ Features

- 🧠 **AI Project Roadmaps** — Detailed development plans for any project idea
- ⚡ **Hackathon Mode** — MVP-focused guidance for time-constrained builds
- 🛠 **Tech Stack Advisor** — Opinionated recommendations based on skill level
- 🎓 **Beginner Mode** — Student-friendly explanations and step-by-step guidance
- 💬 **Streaming Responses** — Word by word streaming like ChatGPT
- 📋 **Copy Responses** — One click copy on any AI response

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Framer Motion |
| Backend | Python, Flask |
| AI | Google Gemini API (gemini-2.0-flash-lite) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
python app.py
# Backend runs at http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:5000
npm run dev
# Frontend runs at http://localhost:3000
```

## 📁 Project Structure
projectra-ai/
├── backend/
│   ├── app.py              ← Flask + Gemini API
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     ← UI components
│   │   ├── pages/          ← Landing + Chat pages
│   │   ├── hooks/          ← useChat state management
│   │   └── utils/
│   └── package.json
└── README.md

## 🔑 Environment Variables

**Backend (.env):**
```
# Recommended: comma-separated list of keys, rotated automatically on rate-limit
GEMINI_API_KEYS=key1,key2,key3

# Fallback (used only if GEMINI_API_KEYS is unset)
# GEMINI_API_KEY=your_single_key
```

**Frontend (.env):**
VITE_API_URL=http://localhost:5000

## 🌐 Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Live at: [https://projectra-nu.vercel.app](https://projectra-nu.vercel.app)

## 👤 Author
**Samarth N G**

## 📄 License
MIT
