"""LLM-based quote analysis: compare, detect hidden costs, score, recommend."""

import json

from core.llm import get_client, get_model
from core.models import ComparisonCriteria, ParsedQuote, QuoteAnalysis


ANALYZE_PROMPT = """You are a quote analysis expert. Compare the following vendor quotes and provide a comprehensive analysis.

## User's Comparison Criteria
{criteria}

## Parsed Quotes
{quotes}

## Your Task
Analyze these quotes and return a JSON object matching this schema:
{schema}

## Analysis Guidelines

1. **Normalized Categories**: List all unique categories across all quotes after normalizing similar terms.

2. **Hidden Costs**: Identify items that appear in some quotes but not others. These are potential hidden costs for vendors who didn't include them. For each:
   - vendor: Which vendor is missing this
   - item: What's missing
   - estimated_amount: Estimate based on other quotes
   - reason: Why this matters

3. **Scoring (0-100)**: Score each quote based on the user's criteria:
   - Weight by priority order (first priority = highest weight)
   - Check must_include items - penalize missing ones heavily
   - Check budget_limit - penalize exceeding it
   - Consider true total (base + hidden costs)

4. **Ranking**: Order quotes by score (highest first). For each:
   - base_price: The quoted total
   - true_total: base_price + estimated hidden costs
   - score: The 0-100 score
   - pros: What's good about this quote
   - cons: What's concerning

5. **Recommendation**: Plain English recommendation of which vendor to choose and why, directly tied to the user's stated priorities.

6. **Reasoning**: Step-by-step explanation of how you arrived at your recommendation, referencing the user's criteria.

7. **Confidence**: 0.0-1.0 based on:
   - Quality and completeness of quote data
   - How clearly one quote stands out
   - Consistency of information

8. **Caveats**: Important limitations or things to verify before deciding.

Return only valid JSON."""


def analyze_quotes(
    quotes: list[ParsedQuote],
    criteria: ComparisonCriteria | None = None
) -> QuoteAnalysis:
    """
    Analyze and compare parsed quotes.

    Args:
        quotes: List of parsed quotes to compare
        criteria: User-defined comparison criteria (uses defaults if None)

    Returns:
        QuoteAnalysis with rankings, hidden costs, and recommendation

    Raises:
        ValueError: If analysis fails
    """
    if not quotes:
        raise ValueError("At least one quote is required for analysis")

    if criteria is None:
        criteria = ComparisonCriteria()

    client = get_client()
    model = get_model()

    quotes_json = [q.model_dump() for q in quotes]
    schema = QuoteAnalysis.model_json_schema()

    prompt = ANALYZE_PROMPT.format(
        criteria=criteria.model_dump_json(indent=2),
        quotes=json.dumps(quotes_json, indent=2),
        schema=json.dumps(schema, indent=2)
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

        # Ensure criteria_used reflects what we actually used
        data["criteria_used"] = criteria.model_dump()
        # Include the original parsed quotes
        data["quotes"] = quotes_json

        return QuoteAnalysis.model_validate(data)

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response as JSON: {e}") from e
    except Exception as e:
        raise ValueError(f"Quote analysis failed: {e}") from e
