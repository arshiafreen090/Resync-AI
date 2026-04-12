# Product Requirements Document (PRD)
## ReSync AI — AI-Powered Resume Tailoring & Job Hunt Platform

**Version:** 1.0  
**Date:** February 2026  
**Status:** MVP Planning  
**Author:** ReSync AI Product Team

---

## 1. Vision

ReSync AI empowers college students and freshers to break into the job market by intelligently tailoring their resumes to specific job descriptions, maximizing ATS (Applicant Tracking System) compatibility, and surfacing relevant job opportunities — all from a single, clean, student-friendly platform.

> **Tagline:** *Align Your Resume with the Right Job.*

---

## 2. Problem Statement

Entry-level job seekers and internship applicants face a compounding challenge: they lack the professional experience to naturally match job descriptions, and they don't know how to optimize resumes for ATS systems used by 98% of Fortune 500 companies. As a result, qualified candidates get filtered out before a human ever reads their resume.

**Key pain points:**
- Students don't know which keywords their resume is missing
- Manual resume tailoring for each job is tedious and time-consuming
- Free resume tools don't provide actionable, JD-specific feedback
- Job discovery is scattered across multiple platforms

---

## 3. Target Personas

### Persona 1 — Final Year Student (Primary)
- **Name:** Arjun Mehta, 21
- **Goal:** Land a software engineering internship
- **Pain:** Applies to 30+ jobs, gets no callbacks; doesn't understand ATS
- **Tech Comfort:** High — uses Notion, Figma, GitHub
- **Budget:** Low — prefers free or very cheap tools

### Persona 2 — Recent Graduate (Secondary)
- **Name:** Priya Sharma, 23
- **Goal:** Get first full-time role in data analytics
- **Pain:** Resume gets rejected before screening calls
- **Tech Comfort:** Medium
- **Budget:** Willing to pay ₹100–₹200/month for genuine value

### Persona 3 — Career Switcher (Tertiary)
- **Name:** Rohan Das, 26
- **Goal:** Transition from non-technical to technical role
- **Pain:** Existing resume doesn't reflect transferable skills correctly
- **Tech Comfort:** Medium-Low

---

## 4. Design & Brand Requirements

| Attribute | Specification |
|-----------|--------------|
| Primary Color | `#1A56FF` (Blue) |
| Background | `#F9F6F1` (Warm Cream) |
| Accent Colors | Orange `#FF6B2B`, Purple `#7B5EA7`, Green `#19A667` |
| Text / Ink | `#0E0C0A` (Near-black) |
| Blue Soft | `#EEF2FF` (Light blue tint for badges) |
| Card Shadow | `0 2px 24px rgba(14,12,10,0.06)` |
| Typography — Headlines | Instrument Serif (italic serif, large display) |
| Typography — Body | DM Sans (modern sans-serif, 300–600 weight range) |
| Corner Radius | 12px–20px (Rounded, 100px for pills) |
| Layout | Card-based, sidebar dashboard |
| Aesthetic | Editorial SaaS, warm-minimal, cream-and-ink |

**Design Inspiration:** Editorial SaaS aesthetic — warm cream background, ink-dark text, blue accents, large Instrument Serif display headlines paired with DM Sans body text. Keyword-highlighting UI patterns inspired by Jobsuit.ai. Custom WebGL shader hero with animated FBM noise and mouse parallax.

---

## 4.1 Tech Stack

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

## 5. Feature Requirements

### 5.1 MODE 1 — Tailor Resume According to JD *(Primary MVP)*

#### Step 1: Upload Screen
| Feature | Description | Priority |
|---------|-------------|----------|
| Resume Upload | Accept PDF and DOCX formats, max 5MB | P0 |
| JD Input | Paste text or upload JD file | P0 |
| Analyze Button | Triggers AI processing pipeline | P0 |
| Loading State | Animated processing indicator with step-by-step status | P1 |

#### Step 2: Results Screen — Left Panel
| Feature | Description | Priority |
|---------|-------------|----------|
| ATS Score | Circular progress ring with score (0–100) | P0 |
| JD Breakdown | Parsed Required Skills, Responsibilities, Nice-to-haves | P0 |
| Missing Keywords | Highlighted list of keywords absent from resume | P0 |
| Keyword Match Tags | Color-coded: green (matched), red (missing), yellow (partial) | P1 |
| Suggestions Panel | Actionable improvement recommendations | P0 |

#### Step 2: Results Screen — Right Panel
| Feature | Description | Priority |
|---------|-------------|----------|
| Resume Preview | Rendered preview of resume content | P0 |
| Toggle View | Switch between Original and Tailored version | P0 |
| Inline Modifications | Show original bullet → modified bullet (like Jobsuit.ai pattern) | P1 |
| Accept Changes | Apply all AI suggestions to resume | P0 |
| Download PDF | Export optimized resume as PDF | P0 |

#### Similar Jobs Section
| Feature | Description | Priority |
|---------|-------------|----------|
| Job Cards | Below the result panels, show 4–6 similar job suggestions | P1 |
| Card Info | Title, Company, Location, Match %, Apply Link | P1 |

---

### 5.2 MODE 2 — Job Hunt *(n8n Powered)*

| Feature | Description | Priority |
|---------|-------------|----------|
| Resume-Based Discovery | Extract skills from resume, surface matching jobs | P1 |
| n8n Webhook | Send structured skill data to n8n automation workflow | P1 |
| Job Cards | Title, Company, Location, Experience Level, Remote/Onsite, Match %, Apply Link | P1 |
| Ranking | Jobs ranked by match percentage | P1 |
| Daily Recommendations | Optional scheduled refresh (post-MVP) | P2 |
| Email Alerts | Optional notification system (post-MVP) | P2 |

---

### 5.3 Landing Page

| Section | Content |
|---------|---------|
| Hero | Headline, subheading, CTA ("Get Started") |
| How It Works | 3-step visual: Upload → Add JD → Get Results |
| Features | ATS Optimization, AI Tailoring, Smart Job Hunt, Student-Focused |
| Pricing | Free Tier + Pro Plan (₹10/month) |
| Footer | About, Privacy, Contact, Terms |

---

### 5.4 Dashboard

**Left Sidebar Navigation:**
- Dashboard (Overview)
- Tailor Resume
- Job Hunt
- History
- Subscription
- Settings
- Logout

**Main Content Area:** Dynamic based on selected mode.

---

## 6. User Flows

### Flow 1 — New User Resume Tailoring
```
Landing Page
    ↓ Click "Get Started"
Sign Up / Login
    ↓
Dashboard → Tailor Resume
    ↓
Upload Resume (PDF/DOCX) + Paste JD
    ↓
Click "Analyze & Tailor"
    ↓
Loading Screen (AI processing ~10–30s)
    ↓
Results Screen
    ├── Left: ATS Score + JD Breakdown + Missing Keywords
    └── Right: Resume Preview (Original ↔ Tailored toggle)
              ↓ Accept Changes
              ↓ Download Optimized Resume (PDF)
              ↓ View Similar Jobs
```

### Flow 2 — Job Hunt Mode
```
Dashboard → Job Hunt
    ↓
Upload / Use Existing Resume
    ↓
System extracts skills → Sends to n8n webhook
    ↓
n8n: Calls job APIs → Filters & ranks
    ↓
Dashboard displays ranked Job Cards
    ↓
User clicks Apply Link (external redirect)
```

---

## 7. ATS Scoring Logic

**Base Formula:**
```
ATS Score = (Matched Keywords / Total JD Keywords) × 100
```

**Weighted Scoring (v1.1 enhancement):**

| Category | Weight |
|----------|--------|
| Technical Skills | 40% |
| Tools & Technologies | 30% |
| Soft Skills / Responsibilities | 20% |
| Education / Certifications | 10% |

**Score Tiers:**
- 🔴 0–40: Poor Match
- 🟡 41–65: Moderate Match
- 🟢 66–85: Good Match
- 🔵 86–100: Excellent Match

---

## 8. Pricing

| Plan | Price | Limits |
|------|-------|--------|
| Free | ₹0/month | 3 resume tailoring sessions, 10 job hunt searches |
| Pro | ₹10/month | Unlimited tailoring, unlimited job hunt, PDF downloads, history |

---

## 9. MVP Scope

**✅ IN SCOPE:**
- User authentication (signup/login)
- Resume upload (PDF/DOCX)
- JD input (paste or upload)
- AI-powered ATS scoring
- Missing keyword analysis
- JD breakdown display
- Resume rewrite (tailored version)
- Original vs. tailored toggle
- PDF download
- Basic job hunt (n8n integration)
- Job cards display
- Dashboard with sidebar navigation

**❌ OUT OF SCOPE (Post-MVP):**
- Drag-and-drop resume editor
- Resume builder from scratch
- Template marketplace
- Interview preparation module
- Portfolio analysis
- Email alerts / daily job digests
- Google Docs export
- Skill gap roadmap

---

## 10. Acceptance Criteria

| Feature | Acceptance Criteria |
|---------|---------------------|
| Resume Upload | Accepts PDF and DOCX ≤5MB; shows error for unsupported formats |
| JD Input | Accepts ≥50 characters of pasted text; JD file upload optional |
| ATS Score | Displays 0–100 score within 30 seconds of submission |
| Missing Keywords | Shows minimum 3 and maximum 20 keywords with context |
| Tailored Resume | Generated resume preserves user's original facts; only rewrites phrasing |
| Toggle | User can switch between original and tailored view without data loss |
| PDF Download | Generates downloadable PDF within 10 seconds of accepting changes |
| Job Cards | Displays minimum 4 jobs per search with all required fields |
| Auth | Login/signup works; dashboard is inaccessible without auth |
| Rate Limiting | Free users blocked after 3 tailoring sessions; upgrade prompt shown |

---

## 11. Future Scope

- Resume builder from scratch
- Template marketplace (multiple resume designs)
- Interview preparation module (mock Q&A based on JD)
- Skill gap roadmap (learning path suggestions)
- Portfolio/GitHub analysis
- LinkedIn profile optimization
- Referral system

---

## 12. Success Metrics

| Metric | Target (Month 3) |
|--------|-----------------|
| Monthly Active Users | 500+ |
| Resume Tailoring Sessions | 2,000+ |
| Pro Conversions | 5% of MAU |
| Average ATS Score Improvement | +20 points |
| NPS Score | ≥40 |
