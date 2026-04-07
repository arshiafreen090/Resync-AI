"""
Professional PDF resume generation using ReportLab.
Produces a clean, ATS-friendly single-column resume layout.
"""
import io
from typing import Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


# ─── Color Palette ───────────────────────────────────────────────────

INK = colors.HexColor("#0E0C0A")
BLUE = colors.HexColor("#1A56FF")
MUTED = colors.HexColor("#6B6560")
LIGHT_GREY = colors.HexColor("#F0EDE8")


# ─── Styles ──────────────────────────────────────────────────────────

def _build_styles() -> dict:
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "name",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=INK,
            spaceAfter=2,
        ),
        "contact": ParagraphStyle(
            "contact",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=6,
        ),
        "summary": ParagraphStyle(
            "summary",
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=INK,
            spaceAfter=8,
        ),
        "section_header": ParagraphStyle(
            "section_header",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=14,
            textColor=BLUE,
            spaceBefore=10,
            spaceAfter=2,
            textTransform="uppercase",
        ),
        "job_title": ParagraphStyle(
            "job_title",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=INK,
        ),
        "job_meta": ParagraphStyle(
            "job_meta",
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=3,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=INK,
            leftIndent=12,
            bulletIndent=4,
            spaceAfter=2,
        ),
        "skill_pill": ParagraphStyle(
            "skill_pill",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=INK,
        ),
        "education": ParagraphStyle(
            "education",
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=INK,
        ),
    }


def _divider() -> HRFlowable:
    return HRFlowable(
        width="100%", thickness=0.5, color=LIGHT_GREY, spaceAfter=4
    )


# ─── Main Generator ──────────────────────────────────────────────────

def generate_pdf_from_json(resume_data: dict[str, Any]) -> bytes:
    """
    Generate a professional ATS-friendly PDF resume from structured JSON.
    
    Expected resume_data schema:
    {
        "basic_info": { name, email, phone, location, linkedin, github },
        "summary": "...",
        "skills": ["Python", ...],
        "experience": [{ title, company, dates, location, bullets: [...] }],
        "education": [{ degree, institution, year, gpa }],
        "projects": [{ name, description, technologies: [...] }],
        "certifications": ["..."]
    }
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )

    styles = _build_styles()
    story = []

    # ── Header: Name ──
    basic = resume_data.get("basic_info", {})
    name = basic.get("name") or "Candidate"
    story.append(Paragraph(name, styles["name"]))

    # ── Contact line ──
    contact_parts = []
    for field in ("email", "phone", "location", "linkedin", "github", "portfolio"):
        val = basic.get(field)
        if val:
            contact_parts.append(val)
    if contact_parts:
        story.append(Paragraph("  ·  ".join(contact_parts), styles["contact"]))

    story.append(_divider())

    # ── Summary ──
    summary = resume_data.get("summary", "").strip()
    if summary:
        story.append(Paragraph("Summary", styles["section_header"]))
        story.append(_divider())
        story.append(Paragraph(summary, styles["summary"]))

    # ── Experience ──
    experience = resume_data.get("experience", [])
    if experience:
        story.append(Paragraph("Experience", styles["section_header"]))
        story.append(_divider())
        for job in experience:
            title = job.get("title", "")
            company = job.get("company", "")
            dates = job.get("dates", "")
            location = job.get("location", "")

            # Title + dates on same line using a table
            meta_right = dates
            if location:
                meta_right = f"{location}  |  {dates}"

            title_table = Table(
                [[
                    Paragraph(f"{title} — {company}", styles["job_title"]),
                    Paragraph(meta_right, styles["job_meta"]),
                ]],
                colWidths=["65%", "35%"],
            )
            title_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            story.append(title_table)
            story.append(Spacer(1, 2))

            for bullet in job.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", styles["bullet"]))
            story.append(Spacer(1, 6))

    # ── Skills ──
    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("Skills", styles["section_header"]))
        story.append(_divider())
        # Format in rows of 4
        skill_chunks = [skills[i:i+4] for i in range(0, len(skills), 4)]
        for chunk in skill_chunks:
            story.append(Paragraph("   •   ".join(chunk), styles["skill_pill"]))
        story.append(Spacer(1, 6))

    # ── Education ──
    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("Education", styles["section_header"]))
        story.append(_divider())
        for edu in education:
            degree = edu.get("degree", "")
            institution = edu.get("institution", "")
            year = edu.get("year", "")
            gpa = edu.get("gpa")
            line = f"{degree} — {institution}"
            if year:
                line += f",  {year}"
            if gpa:
                line += f"  (GPA: {gpa})"
            story.append(Paragraph(line, styles["education"]))
            story.append(Spacer(1, 3))

    # ── Projects ──
    projects = resume_data.get("projects", [])
    if projects:
        story.append(Paragraph("Projects", styles["section_header"]))
        story.append(_divider())
        for proj in projects:
            proj_name = proj.get("name", "")
            desc = proj.get("description", "")
            techs = proj.get("technologies", [])
            line = f"<b>{proj_name}</b>"
            if techs:
                line += f"  [{', '.join(techs)}]"
            story.append(Paragraph(line, styles["bullet"]))
            if desc:
                story.append(Paragraph(desc, styles["bullet"]))
            story.append(Spacer(1, 3))

    # ── Certifications ──
    certs = resume_data.get("certifications", [])
    if certs:
        story.append(Paragraph("Certifications", styles["section_header"]))
        story.append(_divider())
        for cert in certs:
            story.append(Paragraph(f"• {cert}", styles["bullet"]))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
