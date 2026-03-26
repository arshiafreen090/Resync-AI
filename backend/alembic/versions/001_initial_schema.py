"""
Initial production schema setup.
Creates users, resumes, tailoring_sessions, keyword_decisions,
session_output, subscriptions, job_hunts, and job_results tables.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── USERS ──
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("clerk_id", sa.String(length=255), unique=True, nullable=True),
        sa.Column("email", sa.String(length=255), unique=True, nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("plan", sa.String(length=20), server_default="free"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_users_email", "users", ["email"])
    op.create_index("idx_users_clerk_id", "users", ["clerk_id"])

    # ── RESUMES ──
    op.create_table(
        "resumes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=True),
        sa.Column("parsed_json", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb"), nullable=False),
        sa.Column("raw_text", sa.Text(), server_default="", nullable=False),
        sa.Column("base_ats_score", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_resumes_user_id", "resumes", ["user_id"])

    # ── TAILORING SESSIONS ──
    op.create_table(
        "tailoring_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True),
        sa.Column("jd_text", sa.Text(), nullable=False),
        sa.Column("jd_parsed_json", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb")),
        sa.Column("status", sa.String(length=20), server_default="pending"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("initial_ats_score", sa.Integer(), nullable=True),
        sa.Column("final_ats_score", sa.Integer(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_sessions_user_id", "tailoring_sessions", ["user_id"])
    op.create_index("idx_sessions_resume_id", "tailoring_sessions", ["resume_id"])
    op.create_index("idx_sessions_status", "tailoring_sessions", ["status"])

    # ── KEYWORD DECISIONS ──
    op.create_table(
        "keyword_decisions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tailoring_sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("keyword", sa.String(length=255), nullable=False),
        sa.Column("match_type", sa.String(length=30), nullable=False),
        sa.Column("user_decision", sa.String(length=20), server_default="pending"),
        sa.Column("original_bullet", sa.Text(), nullable=True),
        sa.Column("modified_bullet", sa.Text(), nullable=True),
        sa.Column("added_bullet", sa.Text(), nullable=True),
        sa.Column("reasoning", sa.Text(), nullable=True),
        sa.Column("placement", sa.String(length=255), nullable=True),
        sa.Column("section", sa.String(length=50), nullable=True),
        sa.Column("clarifying_question", sa.Text(), nullable=True),
        sa.Column("clarifying_answer", sa.Text(), nullable=True),
        sa.Column("decided_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_kw_session_id", "keyword_decisions", ["session_id"])
    op.create_index("idx_kw_match_type", "keyword_decisions", ["match_type"])
    op.create_index("idx_kw_decision", "keyword_decisions", ["user_decision"])

    # ── SESSION OUTPUT ──
    op.create_table(
        "session_output",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tailoring_sessions.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("tailored_resume_json", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb")),
        sa.Column("tailored_pdf_url", sa.String(length=500), nullable=True),
        sa.Column("tailored_docx_url", sa.String(length=500), nullable=True),
        sa.Column("pdf_generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_output_session_id", "session_output", ["session_id"])

    # ── SUBSCRIPTIONS ──
    op.create_table(
        "subscriptions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stripe_customer_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(length=255), nullable=True),
        sa.Column("plan", sa.String(length=20), server_default="free"),
        sa.Column("status", sa.String(length=20), server_default="active"),
        sa.Column("current_period_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_subs_user_id", "subscriptions", ["user_id"])

    # ── JOB HUNTS ──
    op.create_table(
        "job_hunts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True),
        sa.Column("filters_json", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb")),
        sa.Column("status", sa.String(length=20), server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_hunts_user_id", "job_hunts", ["user_id"])

    # ── JOB RESULTS ──
    op.create_table(
        "job_results",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("hunt_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("job_hunts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("work_type", sa.String(length=20), nullable=True),
        sa.Column("experience_level", sa.String(length=50), nullable=True),
        sa.Column("match_percent", sa.Integer(), nullable=True),
        sa.Column("match_reasoning", sa.Text(), nullable=True),
        sa.Column("apply_url", sa.String(length=500), nullable=True),
        sa.Column("source", sa.String(length=50), nullable=True),
        sa.Column("found_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_results_hunt_id", "job_results", ["hunt_id"])
    op.create_index("idx_results_match", "job_results", ["match_percent", sa.text("DESC")])


def downgrade() -> None:
    op.drop_table("job_results")
    op.drop_table("job_hunts")
    op.drop_table("subscriptions")
    op.drop_table("session_output")
    op.drop_table("keyword_decisions")
    op.drop_table("tailoring_sessions")
    op.drop_table("resumes")
    op.drop_table("users")
