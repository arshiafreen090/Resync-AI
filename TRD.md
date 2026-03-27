# Technical Requirements Document (TRD)
## ReSync AI — System Architecture & Engineering Specification

**Version:** 1.0  
**Date:** February 2026  
**Status:** MVP Planning  
**Author:** ReSync AI Engineering Team

---

## 1. System Architecture Overview

ReSync AI follows a **decoupled, layered architecture** with a Next.js frontend, FastAPI backend, PostgreSQL database, OpenAI API for AI processing, and n8n for job-hunt automation workflows.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│         Next.js + TypeScript + Tailwind CSS                  │
│              (Vercel — CDN Edge Deployment)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS / REST
┌───────────────────────▼─────────────────────────────────────┐
│                        API LAYER                             │
│              FastAPI (Python) — REST API                      │
│          JWT Auth Middleware | Rate Limiter                   │
│              (Render / Railway — Backend)                     │
└──────┬─────────────────┬──────────────────┬─────────────────┘
       │                 │                  │
┌──────▼──────┐  ┌───────▼────────┐  ┌─────▼──────────────────┐
│ PostgreSQL  │  │  OpenAI API    │  │  n8n Webhook           │
│  Database  │  │  GPT-4o-mini   │  │  Job Automation        │
│  (Supabase │  │  (AI Engine)   │  │  Workflow Engine       │
│  or Render)│  └────────────────┘  └────────────────────────┘
└─────────────┘
       │
┌──────▼──────┐
│   AWS S3 /  │
│ Cloudflare  │
│   R2 (File  │
│  Storage)   │
└─────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version | Hosting |
|-------|-----------|---------|---------|
| Frontend | Next.js | 14+ (App Router) | Vercel |
| Language | TypeScript | 5.x | — |
| Styling | Tailwind CSS | 3.x | — |
| Backend | FastAPI (Python) | 0.110+ | Render / Railway |
| Database | PostgreSQL | 15+ | Supabase / Render |
| ORM | SQLAlchemy + Alembic | 2.x | — |
| AI Engine | OpenAI API | GPT-4o-mini | OpenAI Cloud |
| Automation | n8n | Self-hosted / Cloud | Railway |
| Auth | Clerk or JWT | Latest | Clerk Cloud / Self |
| Payments | Stripe | Latest | Stripe Cloud |
| File Storage | AWS S3 or Cloudflare R2 | — | Cloud |
| PDF Generation | WeasyPrint / ReportLab | Latest | Backend |

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram (Text)

```
users ──< resume_sessions ──< analysis_results
  │                              │
  └──< subscriptions         job_suggestions
  │
  └──< job_hunts ──< job_results
```

---

### 3.2 Table Definitions

#### `users`
```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(255),
    hashed_password VARCHAR(255),           -- NULL if using Clerk OAuth
    clerk_id        VARCHAR(255) UNIQUE,    -- if using Clerk
    plan            VARCHAR(20) DEFAULT 'free',   -- 'free' | 'pro'
    sessions_used   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `resume_sessions`
```sql
CREATE TABLE resume_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_resume_url   VARCHAR(500),     -- S3/R2 temporary URL
    jd_text         TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',  -- pending | processing | complete | failed
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `analysis_results`
```sql
CREATE TABLE analysis_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES resume_sessions(id) ON DELETE CASCADE,
    ats_score           INTEGER,                     -- 0-100
    matched_keywords    JSONB,                       -- ["Python", "SQL", ...]
    missing_keywords    JSONB,                       -- ["Docker", "Kubernetes", ...]
    jd_breakdown        JSONB,                       -- {required_skills, responsibilities, nice_to_have}
    original_resume_text TEXT,
    tailored_resume_json JSONB,                      -- structured resume sections
    tailored_resume_url  VARCHAR(500),               -- S3/R2 PDF URL
    suggestions         JSONB,                       -- [{type, original, modified, reason}]
    created_at          TIMESTAMPTZ DEFAULT now()
);
```

#### `job_suggestions`
```sql
CREATE TABLE job_suggestions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID REFERENCES resume_sessions(id) ON DELETE SET NULL,
    job_hunt_id     UUID REFERENCES job_hunts(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    company         VARCHAR(255) NOT NULL,
    location        VARCHAR(255),
    experience_level VARCHAR(50),      -- 'Internship' | 'Entry' | 'Mid'
    work_type       VARCHAR(20),       -- 'Remote' | 'Onsite' | 'Hybrid'
    match_percent   INTEGER,
    apply_url       VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `job_hunts`
```sql
CREATE TABLE job_hunts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url      VARCHAR(500),
    extracted_skills JSONB,            -- skills extracted from resume
    status          VARCHAR(20) DEFAULT 'pending',
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `subscriptions`
```sql
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id  VARCHAR(255),
    stripe_sub_id       VARCHAR(255),
    plan                VARCHAR(20) DEFAULT 'free',
    status              VARCHAR(20),   -- 'active' | 'cancelled' | 'past_due'
    current_period_end  TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. API Design

### Base URL
```
Production:  https://api.resyncc.ai/v1
Development: http://localhost:8000/v1
```

### 4.1 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/logout` | Invalidate token |
| GET | `/auth/me` | Get current user profile |

#### POST `/auth/register`
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Arjun Mehta"
}

// Response 201
{
  "user_id": "uuid",
  "email": "user@example.com",
  "plan": "free",
  "token": "jwt_token_here"
}
```

---

### 4.2 Resume & Analysis Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/resume/upload` | Upload resume file | ✅ |
| POST | `/resume/analyze` | Start analysis session | ✅ |
| GET | `/resume/session/{session_id}` | Poll session status | ✅ |
| GET | `/resume/result/{session_id}` | Get full analysis result | ✅ |
| POST | `/resume/download/{session_id}` | Generate & return PDF | ✅ |
| GET | `/resume/history` | List user's past sessions | ✅ |

#### POST `/resume/analyze`
```json
// Request (multipart/form-data or JSON)
{
  "resume_text": "Extracted text from PDF...",  // or
  "resume_url": "s3://temp/file.pdf",
  "jd_text": "We are looking for a Software Engineer with..."
}

// Response 202 (accepted, processing)
{
  "session_id": "uuid",
  "status": "processing",
  "estimated_time_seconds": 20
}
```

#### GET `/resume/result/{session_id}`
```json
// Response 200
{
  "session_id": "uuid",
  "status": "complete",
  "ats_score": 72,
  "matched_keywords": ["Python", "FastAPI", "PostgreSQL"],
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
  "jd_breakdown": {
    "required_skills": ["Python", "SQL", "REST APIs"],
    "responsibilities": ["Build microservices", "Write unit tests"],
    "nice_to_have": ["Docker", "AWS"]
  },
  "suggestions": [
    {
      "type": "modification",
      "keyword": "Machine Learning",
      "original_bullet": "Developed predictive algorithms...",
      "modified_bullet": "Developed machine learning algorithms...",
      "reasoning": "Adding explicit ML keyword improves ATS match."
    }
  ],
  "tailored_resume": { /* structured JSON */ },
  "job_suggestions": [ /* array of job cards */ ]
}
```

---

### 4.3 Job Hunt Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/jobs/hunt` | Trigger n8n job hunt workflow | ✅ |
| GET | `/jobs/hunt/{hunt_id}` | Get job hunt status & results | ✅ |
| GET | `/jobs/suggestions` | Get latest job suggestions for user | ✅ |

#### POST `/jobs/hunt`
```json
// Request
{
  "resume_url": "s3://temp/resume.pdf"  // or use existing session
}

// Response 202
{
  "hunt_id": "uuid",
  "status": "processing"
}
```

---

### 4.4 Subscription Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/subscription/checkout` | Create Stripe checkout session | ✅ |
| POST | `/subscription/webhook` | Stripe webhook handler | ❌ (Stripe sig) |
| GET | `/subscription/status` | Get user's current plan | ✅ |
| DELETE | `/subscription/cancel` | Cancel subscription | ✅ |

---

## 5. AI Integration Workflow

### 5.1 Resume Analysis Pipeline

```
1. TEXT EXTRACTION
   ├── PDF → PyMuPDF / pdfplumber
   └── DOCX → python-docx
   
2. RESUME STRUCTURING (OpenAI GPT-4o-mini)
   Prompt: "Convert this resume text into structured JSON with 
   sections: personal_info, skills, experience, education, projects"
   Output: Structured resume JSON

3. JD PARSING (OpenAI GPT-4o-mini)
   Prompt: "Parse this JD and extract: required_skills, 
   responsibilities, nice_to_have, experience_level"
   Output: Structured JD JSON

4. KEYWORD MATCHING (Python — Local)
   - TF-IDF + exact matching + synonym matching
   - Compare resume skills vs JD required_skills
   - Compute ATS score

5. GAP ANALYSIS (OpenAI GPT-4o-mini)
   Prompt: "Given resume JSON and JD JSON, identify:
   (a) matched keywords, (b) missing keywords, (c) contextual matches"
   Output: Gap analysis JSON

6. RESUME REWRITING (OpenAI GPT-4o-mini)
   Prompt: "Rewrite the following experience bullets to 
   naturally incorporate these missing keywords: [list].
   Rules: Preserve factual accuracy. Don't invent experiences."
   Output: Modified bullets with original/modified pairs + reasoning

7. JOB SUGGESTION (via n8n or OpenAI)
   - Use extracted skills to query job APIs
   - Rank by match percentage
   - Return top 6 jobs
```

### 5.2 OpenAI Prompt Templates

**Resume Structuring Prompt:**
```
System: You are a professional resume parser. Extract and return ONLY valid JSON.

User: Parse this resume into the following JSON schema:
{
  "name": "", "email": "", "phone": "", "summary": "",
  "skills": [], "experience": [{"title":"","company":"","dates":"","bullets":[]}],
  "education": [{"degree":"","institution":"","year":""}],
  "projects": [{"name":"","description":"","technologies":[]}]
}

Resume text: {{resume_text}}
```

**Resume Rewriting Prompt:**
```
System: You are an expert ATS resume optimizer. 
Rules: 
1. Preserve all factual information — never invent experience
2. Only rephrase existing bullets to include JD keywords naturally
3. Return JSON with original_bullet, modified_bullet, keyword_added, reasoning

User: Rewrite the following resume bullets to incorporate these keywords: {{missing_keywords}}
Bullets: {{experience_bullets}}
```

---

## 6. n8n Integration Plan

**Template Used:** [n8n Workflow #6239 — LinkedIn Job Search: Auto-Match Resume with AI + Cover Letter & Telegram Alerts](https://n8n.io/workflows/6239-linkedin-job-search-auto-match-resume-with-ai-cover-letter-and-telegram-alerts/)

### 6.1 Workflow Node Map

```
[Schedule Trigger] → Daily 5 PM
    │
    ▼
[Google Drive] → Download resume PDF  (bypassed in API mode — resume_text passed directly)
    │
    ▼
[Extract From File] → PDF → raw text
    │
    ▼
[Google Sheets Read] → Job filter criteria (keywords, location, experience_level, etc.)
    │
    ▼
[Code Node JS] → Build LinkedIn search URL from filters
    │
    ▼
[HTTP Request] → Fetch LinkedIn jobs HTML
    │
    ▼
[HTML Extractor] → Parse all job posting links
    │
    ▼
[Loop Over Items] ◄──────────────────────────────────────┐
    │                                                     │
    ▼                                                     │
[HTTP Request] → Fetch individual job description         │
    │                                                     │
    ▼                                                     │
[AI Node — GPT-4o-mini / Gemini]                          │
    - match_score: 0–100                                  │
    - match_reasoning: 1-2 sentences                      │
    - cover_letter: full personalized letter              │
    │                                                     │
    ▼                                                     │
[Google Sheets Write] → Log job + score + cover letter    │
    │                                                     │
    ▼                                                     │
[Score Filter] match_score >= 75?                         │
    ├── YES → [Telegram Node] Send alert                  │
    │                                                     │
    └── NO ───────────────────────────────────────────────┘
```

### 6.2 ReSync AI Platform Integration

When triggered from the ReSync AI dashboard (Job Hunt mode), the workflow skips the Google Drive step — resume text is passed directly via webhook payload:

```
FastAPI Backend
    │
    │ POST https://n8n.resyncc.ai/webhook/job-hunt
    │ Headers: { X-Internal-Key: "secret" }
    │ Payload:
    │ {
    │   "user_id": "uuid",
    │   "hunt_id": "uuid",
    │   "resume_text": "full resume text from prior analysis",
    │   "filters": {
    │     "keywords": "software engineer intern",
    │     "location": "Bangalore, India",
    │     "experience_level": "1,2",
    │     "date_posted": "r86400",
    │     "work_type": "2",
    │     "min_match_score": 75
    │   }
    │ }
    ↓
n8n executes workflow:
    - Skips Google Drive node
    - Builds LinkedIn URL from filters
    - Scrapes jobs → AI scores each
    - Filters ≥ 75% match
    - POSTs results back:
      POST https://api.resyncc.ai/v1/internal/jobs/store
      { user_id, hunt_id, jobs: [...] }
    ↓
FastAPI stores to PostgreSQL → job_suggestions table
Frontend polls GET /jobs/hunt/{hunt_id} → renders Job Cards
```

### 6.3 AI Prompt Used in Workflow

```
System: You are a professional career advisor and ATS expert.

Given the resume and job description below, return ONLY this JSON:
{
  "match_score": <0-100>,
  "match_reasoning": "<1-2 sentence explanation>",
  "cover_letter": "<full 3-paragraph cover letter>"
}

Resume: {{resume_text}}
Job Description: {{job_description}}
```

### 6.4 n8n Job Object Schema (Returned to ReSync AI)

```json
{
  "title": "Software Engineering Intern",
  "company": "Google",
  "location": "Bangalore, India",
  "experience_level": "Internship",
  "work_type": "Remote",
  "match_percent": 87,
  "match_reasoning": "Strong Python and API skills align with core JD requirements",
  "cover_letter": "Dear Hiring Manager...",
  "apply_url": "https://linkedin.com/jobs/view/...",
  "source": "linkedin",
  "found_at": "2026-02-27T17:00:00Z"
}
```

### 6.5 Required Credentials in n8n

| Credential | Node | Setup |
|-----------|------|-------|
| Google OAuth2 | Drive + Sheets nodes | n8n Settings → Credentials → Google OAuth2 |
| OpenAI API Key | AI Node | n8n → Credentials → OpenAI |
| Telegram Bot Token | Telegram node | Create bot via @BotFather, paste token |
| Internal Webhook Secret | Webhook node | Match `N8N_INTERNAL_KEY` env var in FastAPI |

### 6.6 Google Sheets Structure

**Tab 1 — `Filters`** (Read by n8n):

| keywords | location | experience_level | date_posted | work_type | min_match_score |
|---------|---------|-----------------|------------|-----------|----------------|
| software engineer intern | Bangalore | 1,2 | r86400 | 2 | 75 |

**Tab 2 — `Results`** (Written by n8n):

| job_title | company | location | match_score | cover_letter | job_url | status | date_found |
|---------|---------|---------|------------|-------------|--------|--------|-----------|
| Auto-filled | Auto-filled | Auto-filled | Auto-filled | Auto-filled | Auto-filled | Notified/Skipped | Auto-filled |

---

## 7. File Handling & Storage

| Step | Action | Storage |
|------|--------|---------|
| Upload | User uploads resume | AWS S3 / Cloudflare R2 (temp bucket) |
| Processing | Extract text, delete raw file | Delete from S3 within 1 hour |
| Output | Store tailored PDF | S3 (user-specific folder, 7-day TTL) |
| Download | Signed URL generated | Expires after 15 minutes |

**File constraints:**
- Max upload size: 5MB
- Accepted formats: PDF, DOCX
- Filenames: Sanitized and renamed to UUID on upload
- No raw PII stored beyond processing window

---

## 8. Security Architecture

### 8.1 Authentication
- JWT tokens (HS256), 24-hour expiry with refresh token rotation
- Clerk optional (for OAuth: Google, GitHub)
- All dashboard routes require valid JWT in `Authorization: Bearer` header

### 8.2 File Security
- Pre-signed S3 URLs for uploads (direct browser-to-S3, no file passes through backend)
- Lambda / background job deletes raw files after text extraction
- Tailored PDFs stored with user-scoped path: `/{user_id}/{session_id}/tailored.pdf`

### 8.3 API Security

| Measure | Implementation |
|---------|---------------|
| Rate Limiting | 10 req/min for analysis; 60 req/min general | 
| Input Validation | Pydantic models on all inputs |
| SQL Injection | SQLAlchemy ORM (parameterized queries) |
| XSS | Content-Security-Policy headers via FastAPI middleware |
| CORS | Allowlist: `resyncc.ai`, `localhost:3000` |
| n8n Internal Webhook | `X-Internal-Key` header secret (stored in env) |
| Stripe Webhook | Stripe signature verification (`stripe-signature` header) |

### 8.4 Data Privacy
- Resume text deleted from database after 30 days
- Raw resume files deleted from S3 within 1 hour of processing
- Users can request full data deletion via settings
- No resume data shared with third parties

---

## 9. Frontend Architecture

### 9.1 Project Structure
```
/app
  /(auth)
    /login
    /signup
  /(dashboard)
    /dashboard
    /tailor
    /jobs
    /history
    /subscription
    /settings
  /(public)
    / (landing page)
    /pricing
/components
  /ui (shadcn/ui base components)
  /resume (ResumePreview, ATSScoreRing, KeywordBadge, etc.)
  /jobs (JobCard, JobGrid)
  /layout (Sidebar, Header, MobileNav)
/lib
  /api (typed API client functions)
  /utils
/hooks (useSession, useAnalysis, useJobHunt)
/store (Zustand global state)
```

### 9.2 Key Components

**ATSScoreRing** — Circular SVG progress ring with animated fill, color changes based on score tier (red/yellow/green/blue).

**KeywordBadge** — Pill-style tag component, variants: `matched` (green), `missing` (red), `partial` (yellow).

**ResumePanel** — Two-tab panel showing Original vs Tailored resume with diff highlighting.

**ModificationCard** — Card component showing `original_bullet`, `modified_bullet`, `reasoning` with Accept / Reject / Edit actions (inspired by Jobsuit.ai interaction pattern).

**JobCard** — Card with company logo placeholder, title, company, location, remote tag, match percent badge, and Apply button.

---

## 10. Deployment Strategy

### 10.1 Frontend (Vercel)
```yaml
Framework: Next.js (App Router)
Build: vercel build
Deploy: Automatic on push to main branch
Domain: resyncc.ai
Environment Variables:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - NEXT_PUBLIC_STRIPE_KEY
```

### 10.2 Backend (Render / Railway)
```yaml
Runtime: Python 3.11
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Build Command: pip install -r requirements.txt
Health Check: GET /health
Environment Variables:
  - DATABASE_URL
  - OPENAI_API_KEY
  - JWT_SECRET
  - AWS_ACCESS_KEY / AWS_SECRET_KEY / S3_BUCKET
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - N8N_WEBHOOK_URL
  - N8N_INTERNAL_KEY
```

### 10.3 n8n (Railway / n8n Cloud)
```
Option A: n8n Cloud (easiest for MVP)
Option B: Self-hosted on Railway Docker container
Webhook URL exposed: https://n8n.resyncc.ai/webhook/job-hunt
```

### 10.4 CI/CD Pipeline
```
GitHub → Push to main
    ├── Vercel: Auto-deploy frontend
    └── Render: Auto-deploy backend (webhook trigger)

GitHub Actions (optional):
    - Run Pytest on backend PRs
    - Run ESLint + TypeScript check on frontend PRs
```

---

## 11. Environment Variables Summary

### Backend `.env`
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/resyncc

# Auth
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY_HOURS=24

# OpenAI
OPENAI_API_KEY=sk-...

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=resyncc-files
S3_REGION=ap-south-1

# n8n
N8N_WEBHOOK_URL=https://n8n.resyncc.ai/webhook/job-hunt
N8N_INTERNAL_KEY=internal-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# App
FRONTEND_URL=https://resyncc.ai
MAX_FILE_SIZE_MB=5
FREE_TIER_SESSION_LIMIT=3
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://api.resyncc.ai/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| API Response (non-AI) | < 200ms |
| AI Analysis (full pipeline) | < 30 seconds |
| PDF Generation | < 5 seconds |
| Frontend LCP | < 2.5 seconds |
| Uptime | 99.5% |
| File Upload Speed | < 3 seconds for 5MB |

---

## 13. Scalability Considerations (Post-MVP)

- Move AI pipeline to background workers (Celery + Redis) for async processing
- Add Redis caching for repeated JD analysis (same JD, multiple users)
- CDN for resume PDF delivery
- Horizontal scaling of FastAPI workers on Render
- Database connection pooling (PgBouncer)
- Rate limit tiers based on subscription plan (Upstash Redis)
