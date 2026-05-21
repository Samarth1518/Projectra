# Projectra AI

> From idea to deployment.

A Gemini-powered AI developer assistant for engineering students, hackathon participants, and beginners. Get project roadmaps, tech stack recommendations, and hackathon MVP plans — instantly.

## Features

- 🧠 **AI Project Roadmaps** — Detailed development plans for any project idea
- ⚡ **Hackathon Mode** — MVP-focused guidance for time-constrained builds
- 🛠 **Tech Stack Advisor** — Opinionated recommendations based on your skill level
- 🎓 **Beginner Mode** — Student-friendly explanations and step-by-step guidance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Framer Motion |
| Backend | Python, Flask |
| AI | Google Gemini API (gemini-1.5-flash) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the Flask server
python app.py
```

The backend will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

```
projectra-ai/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   └── RoadmapCard.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── ChatDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── utils/
│   │   │   └── formatResponse.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import the `frontend/` directory into Vercel
3. Set `VITE_API_URL` to your Render backend URL in the Vercel environment variables
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set the root directory to `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Add `GEMINI_API_KEY` as an environment variable in the Render dashboard

## Screenshots

> Add screenshots here

## License

MIT
