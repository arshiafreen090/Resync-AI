"""
Input sanitization — prevents prompt injection and XSS.
Applied to all user text before it reaches Groq prompts.
"""
import re
from fastapi import HTTPException

try:
    import bleach
except ImportError:
    bleach = None  # type: ignore

# Known prompt injection patterns
INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "ignore the above",
    "disregard previous",
    "disregard all",
    "you are now",
    "new instructions:",
    "system:",
    "assistant:",
    "\\[INST\\]",
    "\\[/INST\\]",
    "<|im_start|>",
    "<|im_end|>",
    "<<SYS>>",
    "<</SYS>>",
]

# Precompile regex for performance
_injection_regex = re.compile(
    "|".join(INJECTION_PATTERNS),
    re.IGNORECASE,
)


def sanitize_text(text: str, max_length: int = 8000, field_name: str = "input") -> str:
    """
    Sanitize user-provided text:
    1. Strip HTML tags
    2. Enforce max length
    3. Block prompt injection patterns
    4. Strip excessive whitespace

    Raises HTTPException(400) if injection detected.
    """
    if not text or not text.strip():
        raise HTTPException(400, f"{field_name} cannot be empty")

    # 1. Strip HTML tags
    if bleach is not None:
        text = bleach.clean(text, tags=[], attributes={}, strip=True)
    else:
        # Fallback: basic HTML tag stripping
        text = re.sub(r"<[^>]+>", "", text)

    # 2. Hard length limit
    text = text[:max_length]

    # 3. Check for prompt injection
    if _injection_regex.search(text):
        raise HTTPException(
            400,
            f"Invalid {field_name} content detected. "
            "Please remove any instruction-like text and try again."
        )

    # 4. Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def sanitize_jd_text(text: str) -> str:
    """Sanitize job description text — 8000 char limit."""
    return sanitize_text(text, max_length=8000, field_name="job description")


def sanitize_answer(text: str) -> str:
    """Sanitize clarifying question answers — 2000 char limit."""
    return sanitize_text(text, max_length=2000, field_name="answer")
