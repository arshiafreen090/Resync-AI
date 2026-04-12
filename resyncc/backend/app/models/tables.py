"""
SQLAlchemy ORM models — production-grade schema.
All tables have proper indexes, foreign keys, and cascades.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Integer, Text, Boolean, DateTime,
    ForeignKey, Index, text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


# ─────────────── USERS ───────────────
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String(255), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), default="")
    plan = Column(String(20), default="free")  # free | pro | enterprise
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("TailoringSession", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    job_hunts = relationship("JobHunt", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_clerk_id", "clerk_id"),
    )


# ─────────────── RESUMES ───────────────
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=True)
    parsed_json = Column(JSONB, default=dict, server_default=text("'{}'::jsonb"))
    raw_text = Column(Text, default="", server_default=text("''"))
    base_ats_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    user = relationship("User", back_populates="resumes")
    sessions = relationship("TailoringSession", back_populates="resume")

    __table_args__ = (
        Index("idx_resumes_user_id", "user_id"),
    )


# ─────────────── TAILORING SESSIONS ───────────────
class TailoringSession(Base):
    __tablename__ = "tailoring_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    jd_text = Column(Text, nullable=False)
    jd_parsed_json = Column(JSONB, default=dict, server_default=text("'{}'::jsonb"))
    status = Column(
        String(20), default="pending",
        comment="pending | analyzing | reviewing | complete | failed | timed_out"
    )
    error_message = Column(Text, nullable=True)
    initial_ats_score = Column(Integer, nullable=True)
    final_ats_score = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), default=utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    user = relationship("User", back_populates="sessions")
    resume = relationship("Resume", back_populates="sessions")
    keyword_decisions = relationship("KeywordDecision", back_populates="session", cascade="all, delete-orphan")
    output = relationship("SessionOutput", back_populates="session", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_sessions_user_id", "user_id"),
        Index("idx_sessions_resume_id", "resume_id"),
        Index("idx_sessions_status", "status"),
    )


# ─────────────── KEYWORD DECISIONS ───────────────
class KeywordDecision(Base):
    __tablename__ = "keyword_decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("tailoring_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    keyword = Column(String(255), nullable=False)
    match_type = Column(
        String(30), nullable=False,
        comment="contextual | modification | addition | not_applicable | matched"
    )
    user_decision = Column(
        String(20), default="pending",
        comment="pending | accepted | rejected"
    )
    original_bullet = Column(Text, nullable=True)
    modified_bullet = Column(Text, nullable=True)
    added_bullet = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    placement = Column(String(255), nullable=True)
    section = Column(
        String(50), nullable=True,
        comment="experience | skills | projects | education"
    )
    clarifying_question = Column(Text, nullable=True)
    clarifying_answer = Column(Text, nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    session = relationship("TailoringSession", back_populates="keyword_decisions")

    __table_args__ = (
        Index("idx_kw_session_id", "session_id"),
        Index("idx_kw_match_type", "match_type"),
        Index("idx_kw_decision", "user_decision"),
    )


# ─────────────── SESSION OUTPUT ───────────────
class SessionOutput(Base):
    __tablename__ = "session_output"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("tailoring_sessions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    tailored_resume_json = Column(JSONB, default=dict, server_default=text("'{}'::jsonb"))
    tailored_pdf_url = Column(String(500), nullable=True)
    tailored_docx_url = Column(String(500), nullable=True)
    pdf_generated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    session = relationship("TailoringSession", back_populates="output")

    __table_args__ = (
        Index("idx_output_session_id", "session_id"),
    )


# ─────────────── SUBSCRIPTIONS ───────────────
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    plan = Column(String(20), default="free")
    status = Column(String(20), default="active")  # active | canceled | past_due
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    user = relationship("User", back_populates="subscriptions")

    __table_args__ = (
        Index("idx_subs_user_id", "user_id"),
    )


# ─────────────── JOB HUNTS ───────────────
class JobHunt(Base):
    __tablename__ = "job_hunts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    filters_json = Column(JSONB, default=dict, server_default=text("'{}'::jsonb"))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    user = relationship("User", back_populates="job_hunts")
    resume = relationship("Resume")
    results = relationship("JobResult", back_populates="hunt", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_hunts_user_id", "user_id"),
    )


# ─────────────── JOB RESULTS ───────────────
class JobResult(Base):
    __tablename__ = "job_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hunt_id = Column(UUID(as_uuid=True), ForeignKey("job_hunts.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    work_type = Column(String(20), nullable=True)
    experience_level = Column(String(50), nullable=True)
    match_percent = Column(Integer, nullable=True)
    match_reasoning = Column(Text, nullable=True)
    apply_url = Column(String(500), nullable=True)
    source = Column(String(50), nullable=True)
    found_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    hunt = relationship("JobHunt", back_populates="results")

    __table_args__ = (
        Index("idx_results_hunt_id", "hunt_id"),
        Index("idx_results_match", match_percent.desc()),
    )
