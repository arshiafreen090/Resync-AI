# Resync AI

> **AI-powered resume tailoring.** Paste a job description. Resync AI reads every keyword, matches it to your experience, and rewrites your bullets — all in seconds.

---

## Repository Structure

```
Resync-AI/
├── apps/
│   ├── frontend/   # Next.js 14 web application
│   └── backend/    # FastAPI Python backend
├── PRD.md          # Product Requirements Document
└── TRD.md          # Technical Requirements Document
```

## Quick Start

### Frontend (Next.js)

```bash
cd apps/frontend
cp .env.example .env.local   # fill in your Supabase credentials
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See [`apps/frontend/README.md`](apps/frontend/README.md) for full setup instructions.

### Backend (FastAPI)

```bash
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Key Features

- 🔑 **Keyword Extraction & Scoring** — scans job descriptions for required, preferred, and contextual keywords
- ✍️ **AI Bullet Rewriting** — rewrites resume bullets side-by-side with one-click accept/reject
- 🎯 **Contextual Match Detection** — identifies implied experience and asks clarifying questions
- 🛡️ **ATS Score Optimization** — ensures your resume passes applicant tracking systems
- 📄 **Cover Letter Generator** — auto-generates a matching cover letter after tailoring
- 📊 **Live Progress Dashboard** — real-time keyword integration status

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Supabase Auth |
| Backend | FastAPI, Python, PostgreSQL, Redis |
| AI | OpenAI GPT-4, LangChain |
| Storage | Cloudflare R2, Supabase Storage |
| Payments | Stripe |

---

## License

© 2026 Resync AI. Built by [Afreen Aurshi](https://afreen.tech).
