"""PDF text extraction using pdfplumber."""

import io
from pathlib import Path
from typing import BinaryIO

import pdfplumber


def extract_text_from_pdf(pdf_input: str | Path | BinaryIO) -> str:
    """
    Extract raw text from a PDF file.

    Args:
        pdf_input: File path (str or Path) or file-like object with PDF bytes

    Returns:
        Raw text string extracted from all pages

    Raises:
        ValueError: If the PDF cannot be read or contains no text
    """
    try:
        with pdfplumber.open(pdf_input) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)

            if not pages_text:
                raise ValueError("PDF contains no extractable text")

            return "\n\n".join(pages_text)
    except Exception as e:
        if "no extractable text" in str(e):
            raise
        raise ValueError(f"Failed to extract text from PDF: {e}") from e


def extract_text_from_bytes(pdf_bytes: bytes) -> str:
    """
    Extract raw text from PDF bytes.

    Args:
        pdf_bytes: Raw PDF file bytes

    Returns:
        Raw text string extracted from all pages
    """
    return extract_text_from_pdf(io.BytesIO(pdf_bytes))
