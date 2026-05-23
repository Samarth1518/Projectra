# Projectra AI

> From idea to a running repo, in under a minute.

## Live Demo
[https://projectra-nu.vercel.app](https://projectra-nu.vercel.app)

## About
Projectra AI is a Gemini-powered AI developer assistant built for
engineering students, hackathon participants, and beginners. Two
surfaces:

- **Chat Mode**: ask for project roadmaps, hackathon MVPs, tech-stack
  recommendations, beginner walk-throughs. Real token-by-token SSE
  streaming.
- **Build Mode** (flagship): type one sentence, watch the AI generate
  a complete, runnable repo in front of you. Architecture diagram,
  file tree, source code streaming into each file, then one-click
  ZIP / StackBlitz preview / brutally honest AI critique.

Built for the **GDG PESCE Mandya - Build Your Own Chatbot** challenge.

## Features

### Build Mode (`/build`)
- **Architect phase**: Gemini emits a structured plan (summary,
  Mermaid diagram, file manifest) under a strict JSON schema.
- **Coder phase**: per-file streaming generation. Each file appears
  in the tree, then streams its code into the viewer.
- **Download ZIP**: the generated project, archived server-side.
- **Open in StackBlitz**: one click boots a live preview.
- **AI Critique**: a second Gemini persona scores the generated repo
  (novelty, completeness, wow, story) and gives three concrete
  improvements.
- **Voice input**: Web Speech API mic for the idea field.

### Chat Mode (`/chat`)
- AI project roadmaps, Hackathon mode, Tech stack advisor,
  Beginner mode.
- Real SSE streaming as tokens arrive from Gemini.
- Multi-key rotation: comma-separated `GEMINI_API_KEYS` rotate
  transparently on 429 / invalid-key errors.

### Theming
- Built on shadcn / Radix primitives with the tweakcn "Light Green"
  palette.
- Auto-detect light / dark from the OS, plus a manual toggle that
  persists in localStorage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind, shadcn, Radix Icons, framer-motion, react-syntax-highlighter, mermaid, @stackblitz/sdk |
| Backend | Python 3.11, Flask, google-genai SDK |
| AI | Google Gemini (gemini-2.5-flash) |
| Hosting | Vercel (frontend) + Render (backend, gunicorn gthread) |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- One or more Google Gemini API keys from
  [aistudio.google.com](https://aistudio.google.com)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set GEMINI_API_KEYS=key1,key2,key3
python app.py
# Backend on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:5000
npm run dev
# Frontend on http://localhost:3000
```

### Try Build Mode
1. Open `http://localhost:3000/build`
2. Type *"a single-page habit tracker"*, leave stack on **Auto**
3. Click **Build** (or press the mic and speak the idea)
4. Watch the file tree grow and code stream in
5. Hit **Download ZIP**, **Open in StackBlitz**, or **Critique**

## Project Structure
```
projectra-ai/
  backend/
    app.py              # Flask + /api/chat (SSE) + /api/agent/build
    agent.py            # Architect (response_schema) + Coder phases
    render.yaml
    requirements.txt
    .env.example
  frontend/
    src/
      App.jsx                       # routes: /, /chat, /build
      pages/
        LandingPage.jsx
        ChatDashboard.jsx
        BuildPage.jsx
      components/
        MessageBubble.jsx
        theme/{ThemeProvider, ThemeToggle}.jsx
        ui/{button, card, input, badge}.jsx
        build/
          FileTree.jsx
          CodeViewer.jsx
          ArchitectureDiagram.jsx  # mermaid, theme-aware
          StageStepper.jsx
          ResultsBar.jsx           # ZIP / StackBlitz / Critique
          CritiqueDrawer.jsx
          VoiceInputButton.jsx
      hooks/
        useChat.js                 # SSE reader for /api/chat
        useAgentBuild.js           # typed SSE for /api/agent/build
      lib/utils.js                 # cn() helper
    package.json
  README.md
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/api/health` | Returns `{status, keys: <count>}` |
| `POST` | `/api/chat` | SSE stream. Body: `{message, mode}` where mode is one of `normal`, `hackathon`, `beginner`, `stack`, `critique` |
| `POST` | `/api/agent/build` | SSE stream. Body: `{idea, stack}`. Emits `plan`, `diagram`, `manifest`, `architect_done`, `file_start`, `file_chunk`, `file_end`, `done`, `error` |
| `GET`  | `/api/project/<id>/zip` | Downloads the generated project as a ZIP |

## Environment Variables

**Backend (`backend/.env`):**
```
# Recommended: comma-separated list of keys, rotated automatically on rate-limit
GEMINI_API_KEYS=key1,key2,key3

# Fallback (used only if GEMINI_API_KEYS is unset)
# GEMINI_API_KEY=your_single_key
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:5000
```

## Deployment

- Frontend deployed on **Vercel**.
- Backend deployed on **Render** (gunicorn gthread, 8 threads, 120s
  timeout, supports concurrent SSE streams).
- Live at: [https://projectra-nu.vercel.app](https://projectra-nu.vercel.app)

### Deploying to Render

The backend service uses `render.yaml` (root: `backend/`). To enable
multi-key rotation:

1. In the Render dashboard, open the service then **Environment**.
2. Add `GEMINI_API_KEYS` with comma-separated keys
   (for example `key1,key2,key3`, no quotes, no spaces).
3. Save. Render auto-redeploys.
4. Verify at `/api/health` that the `keys` field shows the count.

`GEMINI_API_KEY` (single key) is kept as a fallback for backward
compatibility.

## The recursion

> We built an AI that builds hackathon projects. We used it to build
> itself. We are submitting it to win the hackathon.

## Author
Samarth N G

## License
MIT
