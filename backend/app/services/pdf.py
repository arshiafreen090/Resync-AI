"""
Generates PDF resumes from JSON data.
Uses ReportLab to create the PDF in memory.
"""
import io
from typing import Any

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_from_json(resume_data: dict[str, Any]) -> bytes:
    """
    Generate a basic PDF from tailored resume JSON.
    Returns the PDF content as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18,
    )

    styles = getSampleStyleSheet()
    Story = []

    # Extremely basic PDF generation for MVP
    # In production, this would use a proper template or library
    basic_info = resume_data.get("basic_info", {})
    name = basic_info.get("name", "Tailored Resume")
    
    Story.append(Paragraph(name, styles["Title"]))
    Story.append(Spacer(1, 12))

    summary = resume_data.get("summary", "")
    if summary:
        Story.append(Paragraph("Summary", styles["Heading2"]))
        Story.append(Paragraph(summary, styles["Normal"]))
        Story.append(Spacer(1, 12))

    experience = resume_data.get("experience", [])
    if experience:
        Story.append(Paragraph("Experience", styles["Heading2"]))
        for job in experience:
            title = job.get("title", "")
            company = job.get("company", "")
            Story.append(Paragraph(f"<b>{title} at {company}</b>", styles["Normal"]))
            bullets = job.get("bullets", [])
            for bullet in bullets:
                Story.append(Paragraph(f"• {bullet}", styles["Normal"]))
            Story.append(Spacer(1, 6))

    doc.build(Story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
