"""
AI Processing Pipeline — ReSync AI
Uses three sequential Groq calls to implement the full TRD pipeline:
  1. JD Parsing          → structured job description JSON
  2. Gap Analysis        → keyword matches, missing keywords, ATS score
  3. Bullet Rewriting    → contextual rewrites for each gap keyword

This is a complete rewrite from the single-prompt placeholder.
Each function is independently testable and retried on failure.
"""
import asyncio
import json
import logging
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.core.config import get_settings
from app.core.database import async_session
from app.models.tables import (
    TailoringSession, SessionOutput, KeywordDecision, Resume
)

logger = logging.getLogger(__name__)
settings = get_settings()

# ─────────────────────────────────────────────────────────────────────
# GROQ API WRAPPER
# ─────────────────────────────────────────────────────────────────────

async def _groq_call(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
    timeout: float = 60.0,
) -> dict:
    """
    Core Groq API call — always enforces json_object response mode.
    Raises exception on 429 (rate-limit) or invalid JSON, allowing
    the caller's retry loop to handle it.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": temperature,
    }

    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, headers=headers, json=payload)

        if resp.status_code == 429:
            raise Exception("Groq rate limit hit — will retry")

        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            raise Exception(f"Groq returned non-JSON content: {content[:200]}")


async def _groq_with_retry(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
) -> dict:
    """Wrapper that applies retry logic around _groq_call."""
    last_error: Exception | None = None
    for attempt in range(settings.GROQ_MAX_RETRIES + 1):
        try:
            return await _groq_call(system_prompt, user_prompt, temperature)
        except Exception as e:
            last_error = e
            logger.warning(f"Groq attempt {attempt + 1} failed: {e}")
            if attempt < settings.GROQ_MAX_RETRIES:
                await asyncio.sleep(settings.GROQ_RETRY_DELAY_SECONDS * (attempt + 1))

    raise Exception(
        f"Groq failed after {settings.GROQ_MAX_RETRIES + 1} attempts. "
        f"Last error: {last_error}"
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 0 — SESSION KICKOFF VALIDATION (PROMPT 4)
# ─────────────────────────────────────────────────────────────────────

SYSTEM_SESSION_KICKOFF = """You are a pre-flight validator for a resume tailoring tool.
You receive two inputs: resume text and a job description.
Your job is to check both are usable before the main pipeline runs.

Return ONLY valid JSON.

Schema:
{
  "resume_valid": boolean,
  "jd_valid": boolean,
  "resume_issue": string | null,
  "jd_issue": string | null,
  "job_title": string | null,
  "company_name": string | null,
  "industry": string | null,
  "ready_to_proceed": boolean
}

Rules:
- "resume_valid" = false if: text is under 100 words, contains no experience section, looks like a cover letter, or is garbled/OCR noise.
- "jd_valid" = false if: text is under 80 words, has no role title, or is clearly not a job posting.
- "job_title" and "company_name": extract from JD if detectable, else null.
- "industry": infer from JD (e.g. "Fintech", "Healthcare", "SaaS"). One word or short phrase.
- "ready_to_proceed" = true only if both are valid.
- "resume_issue" / "jd_issue": one plain-English sentence telling the user exactly what's wrong, or null if valid."""


async def validate_session(resume_text: str, jd_text: str) -> dict:
    """Validate inputs before running the main AI pipeline."""
    user_prompt = f"RESUME TEXT:\n{resume_text}\n\nJOB DESCRIPTION:\n{jd_text}"
    return await _groq_with_retry(
        system_prompt=SYSTEM_SESSION_KICKOFF,
        user_prompt=user_prompt,
        temperature=0.1,
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 1 — JD PARSING
# ─────────────────────────────────────────────────────────────────────

SYSTEM_JD_PARSER = """You are a senior technical recruiter. Parse the job description and extract structured information.
Return ONLY valid JSON matching this exact schema — no extra text:
{
  "role_target": {
    "title": "<job title>",
    "company": "<company name or 'Unknown'>",
    "location": "<location or 'Not specified'>",
    "work_type": "<Remote | Onsite | Hybrid | Not specified>",
    "experience_required": "<e.g. '3-5 years' or 'Entry Level'>"
  },
  "must_have_skills": ["<skill1>", "<skill2>", ...],
  "good_to_have_skills": ["<skill1>", ...],
  "key_responsibilities": ["<responsibility1>", ...],
  "who_they_want": "<2-3 sentence profile of ideal candidate>"
}"""


async def parse_jd(jd_text: str) -> dict:
    """Parse raw JD text into structured JSON."""
    return await _groq_with_retry(
        system_prompt=SYSTEM_JD_PARSER,
        user_prompt=f"Parse this job description:\n\n{jd_text}",
        temperature=0.1,
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 2 — GAP ANALYSIS
# ─────────────────────────────────────────────────────────────────────

SYSTEM_GAP_ANALYST = """You are an expert ATS (Applicant Tracking System) analyst.
Compare the resume to the job description and return ONLY valid JSON:
{
  "initial_ats_score": <integer 0-100>,
  "matched_keywords": ["<keyword>", ...],
  "match_summary": {
    "total_jd_keywords": <int>,
    "matched": <int>,
    "contextual": <int>,
    "missing": <int>,
    "not_applicable": <int>
  },
  "keywords": [
    {
      "keyword": "<keyword or phrase>",
      "match_type": "<matched | modification | addition | contextual | not_applicable>",
      "section": "<experience | skills | projects | education | personal>",
      "placement": "<job title / section where this keyword fits best>",
      "original_bullet": "<existing bullet that relates to this keyword, or null>",
      "modified_bullet": "<rewritten version of original_bullet with keyword naturally inserted, or null>",
      "added_bullet": "<completely new bullet showcasing this keyword, or null. Only provide if match_type is addition>",
      "reasoning": "<why this change helps ATS score>",
      "clarifying_question": "<if match_type is contextual: a question to ask the user about their experience with this keyword; otherwise null>"
    }
  ]
}

Match type definitions:
- matched: keyword already appears explicitly in the resume (no action needed)
- modification: keyword implied/related but not explicit; existing bullet can be reworded
- addition: keyword completely missing; a new bullet should be added
- contextual: unclear if candidate has this experience; needs user clarification
- not_applicable: keyword is irrelevant to candidate's stated background

Rules:
- Never invent fake experiences — only rephrase what's genuinely in the resume
- For modification, provide both original_bullet and modified_bullet
- For addition, provide added_bullet
- For contextual, provide clarifying_question
- Focus on keywords from must_have_skills first, then good_to_have_skills
- Return a MAXIMUM of 15 keywords total"""


async def analyze_gaps(resume_text: str, jd_text: str, jd_parsed: dict) -> dict:
    """Run gap analysis between resume and JD."""
    user_prompt = (
        f"RESUME:\n{resume_text}\n\n"
        f"JOB DESCRIPTION:\n{jd_text}\n\n"
        f"PARSED JD CONTEXT:\n{json.dumps(jd_parsed, indent=2)}"
    )
    return await _groq_with_retry(
        system_prompt=SYSTEM_GAP_ANALYST,
        user_prompt=user_prompt,
        temperature=0.2,
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 3 — RESUME TAILORING
# ─────────────────────────────────────────────────────────────────────

SYSTEM_RESUME_TAILOR = """You are an expert ATS resume writer. Rewrite the resume after integrating accepted keyword changes.
Return ONLY valid JSON structured as the complete tailored resume:
{
  "basic_info": {
    "name": "<full name>",
    "email": "<email>",
    "phone": "<phone or null>",
    "location": "<location or null>",
    "linkedin": "<url or null>",
    "github": "<url or null>",
    "portfolio": "<url or null>"
  },
  "summary": "<2-3 sentence professional summary tailored to the target role, or empty string>",
  "skills": ["<skill>", ...],
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "dates": "<e.g. 'Jun 2022 – Aug 2022'>",
      "location": "<city or Remote>",
      "bullets": ["<bullet 1>", "<bullet 2>", ...]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<school name>",
      "year": "<graduation year>",
      "gpa": "<gpa or null>"
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<1-2 sentence description>",
      "technologies": ["<tech1>", ...]
    }
  ],
  "certifications": ["<cert name>", ...]
}

Rules:
- Preserve ALL factual information — never invent degrees, companies, or dates
- Integrate accepted keyword changes naturally into bullets
- Keep bullets concise and impact-focused with metrics where present
- Add a professional summary section targeting the job role"""


async def tailor_resume(
    resume_text: str,
    accepted_keywords: list[dict],
    jd_parsed: dict,
) -> dict:
    """Produce the final tailored resume JSON by applying accepted keyword changes."""
    accepted_str = json.dumps(accepted_keywords, indent=2) if accepted_keywords else "[]"
    role = jd_parsed.get("role_target", {}).get("title", "the target role")

    user_prompt = (
        f"ORIGINAL RESUME:\n{resume_text}\n\n"
        f"TARGET ROLE: {role}\n\n"
        f"ACCEPTED KEYWORD CHANGES TO INTEGRATE:\n{accepted_str}\n\n"
        "Rewrite the resume incorporating these changes. "
        "Return the complete structured resume JSON."
    )
    return await _groq_with_retry(
        system_prompt=SYSTEM_RESUME_TAILOR,
        user_prompt=user_prompt,
        temperature=0.3,
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 4 — DASHBOARD ANALYTICS (PROMPT 5)
# ─────────────────────────────────────────────────────────────────────

SYSTEM_DASHBOARD_ANALYTICS = """You are a career analytics engine. You receive a user's full history of resume tailoring sessions.
Each session contains: job title, company, industry, ATS score, keyword counts, and outcome (if provided).

Generate a structured analytics summary the user can act on.

Return ONLY valid JSON.

Schema:
{
  "total_sessions": integer,
  "average_ats_score": integer,
  "best_session": {
    "job_title": string,
    "company": string,
    "ats_score": integer,
    "session_id": string
  },
  "weakest_session": {
    "job_title": string,
    "company": string,
    "ats_score": integer,
    "session_id": string
  },
  "top_missing_keywords": [string],
  "top_matched_keywords": [string],
  "industry_breakdown": [
    { "industry": string, "count": integer }
  ],
  "ats_trend": "improving" | "declining" | "stable" | "insufficient_data",
  "coaching_insight": string,
  "recommended_next_action": string
}

Rules:
- "top_missing_keywords": the 5 keywords that appeared as "gap" or "contextual" most often across all sessions.
- "top_matched_keywords": the 5 keywords the user consistently already has — their strengths.
- "ats_trend": compare last 3 sessions vs first 3. "insufficient_data" if fewer than 4 sessions.
- "coaching_insight": 1–2 sentences. Be specific. Reference actual keywords or industries from their data. Not generic advice.
- "recommended_next_action": one concrete next step (e.g. "Add SQL to your skills section — it appeared as a gap in 4 of your last 5 sessions.")."""

async def generate_dashboard_analytics(session_history_json: list, today_date: str) -> dict:
    """Read past sessions and generate structured insights for dashboard."""
    # We use temperature 0.2 to get somewhat dynamic coaching while remaining reliable.
    user_prompt = f"USER SESSION HISTORY:\n{json.dumps(session_history_json, indent=2)}\n\nToday's date: {today_date}"
    return await _groq_with_retry(
        system_prompt=SYSTEM_DASHBOARD_ANALYTICS,
        user_prompt=user_prompt,
        temperature=0.2,
    )


# ─────────────────────────────────────────────────────────────────────
# STEP 5 — RESUME HEALTH SCORE (PROMPT 6)
# ─────────────────────────────────────────────────────────────────────

SYSTEM_RESUME_HEALTH = """You are a resume quality auditor. Score the candidate's base resume across five dimensions.
This is NOT job-specific — evaluate the resume on its own merit.

Return ONLY valid JSON.

Schema:
{
  "overall_score": integer,
  "dimensions": {
    "impact": { "score": integer, "issue": string | null },
    "specificity": { "score": integer, "issue": string | null },
    "ats_friendliness": { "score": integer, "issue": string | null },
    "completeness": { "score": integer, "issue": string | null },
    "readability": { "score": integer, "issue": string | null }
  },
  "top_fix": string,
  "strengths": [string]
}

Scoring guide (each dimension 0–20, overall = sum):
- impact:          Do bullets start with strong action verbs and include measurable results?
- specificity:     Are tools, technologies, and scope clearly named? (not vague like "led projects")
- ats_friendliness: Standard section headers? No tables/columns/graphics that break parsers?
- completeness:    Has summary, skills, experience with dates, education?
- readability:     Bullet length consistent? No walls of text? Scannable in 6 seconds?

Rules:
- "issue": one sentence naming the specific problem in that dimension, or null if score >= 17.
- "top_fix": the single highest-ROI change they can make right now.
- "strengths": 2–3 things genuinely working well in this resume."""

async def generate_base_resume_score(parsed_resume_json: dict) -> dict:
    """Score the user's base resume independent of a job description."""
    user_prompt = f"RESUME JSON:\n{json.dumps(parsed_resume_json, indent=2)}"
    return await _groq_with_retry(
        system_prompt=SYSTEM_RESUME_HEALTH,
        user_prompt=user_prompt,
        temperature=0.1,
    )


# ─────────────────────────────────────────────────────────────────────
# BACKGROUND TASK
# ─────────────────────────────────────────────────────────────────────

async def process_tailoring_task(session_id: UUID) -> None:
    """
    Background Task: Full 3-step AI pipeline.
    Steps:
      1. Load resume + session from DB
      2. Parse JD → structured JSON
      3. Run gap analysis → keyword decisions + ATS score
      4. Persist keyword decisions to DB
      5. Set status to 'reviewing' so frontend polling can proceed
    
    Note: Step 3 (bullet rewriting / tailoring) happens AFTER the user
    makes decisions on the keyword review page, via the /sessions/{id}/finalize
    endpoint. This keeps the initial analysis fast (< 15s target).
    """
    async with async_session() as db:
        # ── Load session ──
        stmt = select(TailoringSession).where(TailoringSession.id == session_id)
        result = await db.execute(stmt)
        session_obj = result.scalar_one_or_none()

        if not session_obj:
            logger.error(f"process_tailoring_task: session {session_id} not found")
            return

        session_obj.status = "analyzing"
        await db.commit()
        await db.refresh(session_obj)

        try:
            # ── Load resume text ──
            resume_text = ""
            if session_obj.resume_id:
                resume_stmt = select(Resume).where(Resume.id == session_obj.resume_id)
                resume_result = await db.execute(resume_stmt)
                resume_obj = resume_result.scalar_one_or_none()
                if resume_obj and resume_obj.raw_text:
                    resume_text = resume_obj.raw_text
                    logger.info(
                        f"Loaded {len(resume_text)} chars of resume text "
                        f"for session {session_id}"
                    )

            if not resume_text.strip():
                raise ValueError(
                    "Resume text is empty. Please re-upload your resume via "
                    "the upload endpoint before starting analysis."
                )

            jd_text = session_obj.jd_text

            # ── Step 0: Kickoff Validation ──
            logger.info(f"[{session_id}] Step 0: Validating inputs...")
            validation = await validate_session(resume_text, jd_text)
            
            if not validation.get("ready_to_proceed"):
                error_msgs = []
                if not validation.get("resume_valid"):
                    error_msgs.append(f"Resume Issue: {validation.get('resume_issue', 'Invalid resume format or content.')}")
                if not validation.get("jd_valid"):
                    error_msgs.append(f"JD Issue: {validation.get('jd_issue', 'Invalid job description format or content.')}")
                
                error_str = " | ".join(error_msgs) or "Pre-flight validation failed for inputs."
                raise ValueError(error_str)
            
            # Store some extracted metadata back on the session if useful later
            # (assuming such columns may exist later; for now we just proceed)

            # ── Step 1: Parse JD ──
            logger.info(f"[{session_id}] Step 1: Parsing JD...")
            jd_parsed = await parse_jd(jd_text)
            session_obj.jd_parsed_json = jd_parsed
            await db.commit()

            # ── Step 2: Gap Analysis ──
            logger.info(f"[{session_id}] Step 2: Running gap analysis...")
            gap_analysis = await analyze_gaps(resume_text, jd_text, jd_parsed)

            initial_score = gap_analysis.get("initial_ats_score", 0)
            session_obj.initial_ats_score = initial_score

            # ── Persist keyword decisions ──
            keywords = gap_analysis.get("keywords", [])
            for kw in keywords:
                match_type = kw.get("match_type", "addition")
                # Skip 'matched' keywords — no action needed for those
                if match_type == "matched":
                    continue

                kd = KeywordDecision(
                    session_id=session_id,
                    keyword=kw.get("keyword", ""),
                    match_type=match_type,
                    user_decision="pending",
                    section=kw.get("section"),
                    placement=kw.get("placement"),
                    original_bullet=kw.get("original_bullet"),
                    modified_bullet=kw.get("modified_bullet"),
                    added_bullet=kw.get("added_bullet"),
                    reasoning=kw.get("reasoning"),
                    clarifying_question=kw.get("clarifying_question"),
                )
                db.add(kd)

            # ── Update session ──
            session_obj.status = "reviewing"
            await db.commit()
            logger.info(
                f"[{session_id}] Analysis complete. "
                f"Score: {initial_score}, Keywords: {len(keywords)}"
            )

        except Exception as e:
            logger.error(f"process_tailoring_task failed for {session_id}: {e}")
            session_obj.status = "failed"
            session_obj.error_message = str(e)
            await db.commit()


async def finalize_tailoring_task(session_id: UUID) -> None:
    """
    Background Task: Run after user completes keyword review decisions.
    Takes all accepted keywords, runs the resume tailor prompt,
    and stores the tailored JSON in session_output.
    Triggered by POST /v1/sessions/{id}/finalize.
    """
    async with async_session() as db:
        stmt = (
            select(TailoringSession)
            .where(TailoringSession.id == session_id)
        )
        result = await db.execute(stmt)
        session_obj = result.scalar_one_or_none()

        if not session_obj:
            return

        session_obj.status = "analyzing"  # Brief re-analyze state
        await db.commit()

        try:
            # Load resume text
            resume_text = ""
            if session_obj.resume_id:
                r_stmt = select(Resume).where(Resume.id == session_obj.resume_id)
                r_result = await db.execute(r_stmt)
                r_obj = r_result.scalar_one_or_none()
                if r_obj:
                    resume_text = r_obj.raw_text or ""

            # Load accepted keyword decisions
            kw_stmt = select(KeywordDecision).where(
                KeywordDecision.session_id == session_id,
                KeywordDecision.user_decision == "accepted",
            )
            kw_result = await db.execute(kw_stmt)
            accepted_kws = kw_result.scalars().all()

            accepted_list = [
                {
                    "keyword": kw.keyword,
                    "match_type": kw.match_type,
                    "section": kw.section,
                    "original_bullet": kw.original_bullet,
                    "modified_bullet": kw.modified_bullet,
                    "added_bullet": kw.added_bullet,
                    "clarifying_answer": kw.clarifying_answer,
                }
                for kw in accepted_kws
            ]

            # Load JD parsed
            jd_parsed = session_obj.jd_parsed_json or {}

            # Run tailoring
            logger.info(
                f"[{session_id}] Finalize: tailoring with "
                f"{len(accepted_list)} accepted keywords"
            )
            tailored_json = await tailor_resume(resume_text, accepted_list, jd_parsed)

            # Calculate final score (approximate: initial + accepted keyword boost)
            total_kws_stmt = select(KeywordDecision).where(
                KeywordDecision.session_id == session_id
            )
            total_kws_result = await db.execute(total_kws_stmt)
            all_kws = total_kws_result.scalars().all()
            total = len(all_kws) or 1
            acc_count = len(accepted_list)
            initial = session_obj.initial_ats_score or 50
            final_score = min(100, int(initial + (acc_count / total) * (100 - initial) * 0.7))

            # Persist output
            from sqlalchemy import select as sa_select
            out_stmt = sa_select(SessionOutput).where(
                SessionOutput.session_id == session_id
            )
            out_result = await db.execute(out_stmt)
            existing = out_result.scalar_one_or_none()

            if existing:
                existing.tailored_resume_json = tailored_json
            else:
                output = SessionOutput(
                    session_id=session_id,
                    tailored_resume_json=tailored_json,
                )
                db.add(output)

            session_obj.final_ats_score = final_score
            session_obj.status = "complete"
            await db.commit()
            logger.info(f"[{session_id}] Finalized. Final ATS score: {final_score}")

        except Exception as e:
            logger.error(f"finalize_tailoring_task failed for {session_id}: {e}")
            session_obj.status = "failed"
            session_obj.error_message = str(e)
            await db.commit()
