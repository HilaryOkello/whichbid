"""Pipeline orchestrator: extract -> parse -> analyze."""

from pathlib import Path
from typing import BinaryIO

from core.analyzer import analyze_quotes
from core.extractor import extract_text_from_bytes, extract_text_from_pdf
from core.models import ComparisonCriteria, ParsedQuote, QuoteAnalysis
from core.parser import parse_quote


def run(
    pdf_files: list[str | Path | BinaryIO],
    criteria: ComparisonCriteria | None = None
) -> QuoteAnalysis:
    """
    Run the full quote comparison pipeline.

    Args:
        pdf_files: List of PDF file paths or file-like objects
        criteria: User-defined comparison criteria (optional)

    Returns:
        QuoteAnalysis with complete comparison results

    Raises:
        ValueError: If extraction, parsing, or analysis fails
    """
    if not pdf_files:
        raise ValueError("At least one PDF file is required")

    # Step 1: Extract text from all PDFs
    raw_texts: list[str] = []
    for pdf in pdf_files:
        text = extract_text_from_pdf(pdf)
        raw_texts.append(text)

    # Step 2: Parse each quote (one LLM call per quote)
    parsed_quotes: list[ParsedQuote] = []
    for text in raw_texts:
        quote = parse_quote(text)
        parsed_quotes.append(quote)

    # Step 3: Analyze and compare all quotes (one LLM call)
    analysis = analyze_quotes(parsed_quotes, criteria)

    return analysis


def run_from_bytes(
    pdf_bytes_list: list[bytes],
    criteria: ComparisonCriteria | None = None
) -> QuoteAnalysis:
    """
    Run the pipeline from raw PDF bytes.

    Args:
        pdf_bytes_list: List of raw PDF file bytes
        criteria: User-defined comparison criteria (optional)

    Returns:
        QuoteAnalysis with complete comparison results
    """
    if not pdf_bytes_list:
        raise ValueError("At least one PDF is required")

    # Step 1: Extract text from all PDFs
    raw_texts: list[str] = []
    for pdf_bytes in pdf_bytes_list:
        text = extract_text_from_bytes(pdf_bytes)
        raw_texts.append(text)

    # Step 2: Parse each quote
    parsed_quotes: list[ParsedQuote] = []
    for text in raw_texts:
        quote = parse_quote(text)
        parsed_quotes.append(quote)

    # Step 3: Analyze and compare
    analysis = analyze_quotes(parsed_quotes, criteria)

    return analysis
