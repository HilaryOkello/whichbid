"""LLM-based quote parsing: raw text -> ParsedQuote."""

import json

from core.llm import get_client, get_model
from core.models import ParsedQuote


PARSE_PROMPT = """You are a quote parsing assistant. Extract structured data from the following vendor quote text.

Return a JSON object matching this exact schema:
{schema}

Guidelines:
- vendor_name: The company or person providing the quote
- quote_date: Date the quote was issued (ISO format if possible)
- valid_until: Expiration date of the quote
- line_items: Each distinct item/service with:
  - description: What the item is
  - category: One of "labor", "materials", "permits", "equipment", "other"
  - quantity: Number of units (null if not specified)
  - unit_price: Price per unit (null if not specified)
  - total: Total price for this line item
- subtotal: Sum before tax
- tax: Tax amount (null if not shown)
- total: Final total including tax
- payment_terms: Payment schedule or terms
- timeline: Project timeline or delivery date
- notes: Any other important information

If a field is not present in the quote, use null.
Be precise with numbers - extract exact values from the text.

Quote text:
{text}

Return only valid JSON, no other text."""


def parse_quote(raw_text: str) -> ParsedQuote:
    """
    Parse raw quote text into a structured ParsedQuote.

    Args:
        raw_text: Raw text extracted from a quote PDF

    Returns:
        ParsedQuote with structured data

    Raises:
        ValueError: If parsing fails
    """
    client = get_client()
    model = get_model()

    schema = ParsedQuote.model_json_schema()
    prompt = PARSE_PROMPT.format(
        schema=json.dumps(schema, indent=2),
        text=raw_text
    )

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("LLM returned empty response")

        data = json.loads(content)
        return ParsedQuote.model_validate(data)

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response as JSON: {e}") from e
    except Exception as e:
        raise ValueError(f"Quote parsing failed: {e}") from e
