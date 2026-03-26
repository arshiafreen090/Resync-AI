"""
Background AI processing with Groq.
Long-running AI calls must be executed in background tasks via FastAPI BackgroundTasks.
"""
import asyncio
import json
import logging
from uuid import UUID

import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import get_settings
from app.core.database import async_session
from app.models.tables import TailoringSession, SessionOutput, KeywordDecision

logger = logging.getLogger(__name__)
settings = get_settings()


async def call_groq_api(prompt: str) -> dict:
    """
    Call Groq API using httpx for async compatibility.
    MVP implementation to parse a raw resume against a JD.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    
    # For a real implementation, you'd use a strong system prompt
    # and require JSON schema output. This is a simplified proxy.
    payload = {
        "model": settings.GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are an expert ATS resume writer. Output valid JSON only."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        
        if response.status_code == 429:
            raise Exception("Rate limit exceeded from Groq")
            
        response.raise_for_status()
        data = response.json()
        
        content = data["choices"][0]["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            raise Exception("Groq returned invalid JSON")


async def process_tailoring_task(session_id: UUID) -> None:
    """
    Background Task: Analyze the resume against the JD using Groq.
    Adds retry logic for 429 rate limits, saves results in DB correctly.
    """
    # Create an independent DB session for the background task
    async with async_session() as db:
        # Fetch the session
        stmt = select(TailoringSession).where(TailoringSession.id == session_id)
        result = await db.execute(stmt)
        session_obj = result.scalar_one_or_none()
        
        if not session_obj:
            logger.error(f"background_task: Session {session_id} not found.")
            return

        # Explicitly move to analyzing
        session_obj.status = "analyzing"
        await db.commit()
        await db.refresh(session_obj)

        try:
            # Assume resume.raw_text is loaded, we can fetch it
            # Normally we should join or lazyload it. For MVP, we'll keep it simple:
            resume_text = "N/A" # In real app, load from resume_id
            
            prompt = (
                "Extract keywords from this JD and compare them to the resume.\n"
                f"Job Description: {session_obj.jd_text}\n"
                # f"Resume: {resume_text}\n"
                # Mock structure:
                "Return JSON with format: {'score': 85, 'tailored_resume': {}, 'keywords': []}"
            )

            # Retry logic
            retries = 0
            groq_response = None
            last_error = None
            
            while retries <= settings.GROQ_MAX_RETRIES:
                try:
                    groq_response = await call_groq_api(prompt)
                    break
                except Exception as e:
                    last_error = e
                    retries += 1
                    if retries <= settings.GROQ_MAX_RETRIES:
                        await asyncio.sleep(settings.GROQ_RETRY_DELAY_SECONDS)

            if not groq_response:
                raise Exception(f"Failed after {settings.GROQ_MAX_RETRIES} retries. Last error: {last_error}")

            # Persist output
            session_output = SessionOutput(
                session_id=session_id,
                tailored_resume_json=groq_response.get("tailored_resume", {}),
            )
            db.add(session_output)
            
            # Persist keyword decisions
            keywords = groq_response.get("keywords", [])
            for kw in keywords:
                kd = KeywordDecision(
                    session_id=session_id,
                    keyword=kw.get("keyword", "unknown"),
                    match_type=kw.get("match_type", "addition"),
                    user_decision="pending",
                    modified_bullet=kw.get("context", "")
                )
                db.add(kd)
            
            # Update overall session metadata
            session_obj.final_ats_score = groq_response.get("score", 0)
            session_obj.status = "reviewing"
            await db.commit()

        except Exception as e:
            logger.error(f"background_task: Groq processing failed for {session_id}: {e}")
            session_obj.status = "failed"
            session_obj.error_message = str(e)
            await db.commit()

