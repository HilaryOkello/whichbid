# QuoteMatcher Architecture Plan

## Overview

A fixed pipeline (no agent routing) that extracts, parses, compares, and scores vendor quotes. Uses **OpenRouter** (via OpenAI SDK) for LLM-agnostic access. Shared core logic consumed by both a **Typer CLI** and **FastAPI** web API.

---

## Project Structure

```
quotematcher/
├── main.py                  # FastAPI app entrypoint
├── cli.py                   # Typer CLI entrypoint
├── core/
│   ├── models.py            # Pydantic data models (the standard quote format)
│   ├── pipeline.py          # Orchestrates: extract → parse → analyze
│   ├── extractor.py         # PDF → raw text (pdfplumber)
│   ├── parser.py            # raw text → ParsedQuote (LLM structured output)
│   ├── analyzer.py          # compare + detect hidden costs + score + recommend (LLM)
│   └── llm.py               # OpenRouter client (thin wrapper around OpenAI SDK)
├── api/
│   └── routes.py            # FastAPI route definitions
├── .env                     # OPENROUTER_API_KEY, MODEL
├── requirements.txt
└── README.md
```

---

## Data Models (`core/models.py`)

### Input: User-Defined Comparison Criteria

The user tells the agent **what matters to them**. This makes scoring transparent and explainable.

```python
class ComparisonCriteria(BaseModel):
    """User-provided rubric for how to evaluate quotes."""
    priorities: list[str]          # ordered by importance, e.g. ["price", "timeline", "warranty"]
    must_include: list[str] | None # required items, e.g. ["permits", "insurance"]
    budget_limit: float | None     # max acceptable total, e.g. 50000
    notes: str | None              # free-text context, e.g. "We need this done before March"
```

If no criteria are provided, the agent falls back to sensible defaults (balanced weighting across price, scope completeness, and risk).

### Output: Standard Quote Format

These are the **standard format** a business receives and analyzes:

```python
class QuoteLineItem(BaseModel):
    description: str
    category: str              # "labor", "materials", "permits", "equipment", "other"
    quantity: float | None
    unit_price: float | None
    total: float

class ParsedQuote(BaseModel):
    vendor_name: str
    quote_date: str | None
    valid_until: str | None
    line_items: list[QuoteLineItem]
    subtotal: float
    tax: float | None
    total: float
    payment_terms: str | None
    timeline: str | None
    notes: str | None

class HiddenCost(BaseModel):
    vendor: str
    item: str
    estimated_amount: float
    reason: str                # why this is flagged

class RankedQuote(BaseModel):
    vendor: str
    base_price: float
    true_total: float          # base + hidden costs
    score: float               # 0-100 scored against user criteria
    pros: list[str]
    cons: list[str]

class QuoteAnalysis(BaseModel):
    """The final output — the standard format businesses consume."""
    criteria_used: ComparisonCriteria  # echo back what the agent scored against
    quotes: list[ParsedQuote]
    normalized_categories: list[str]
    hidden_costs: list[HiddenCost]
    ranking: list[RankedQuote]
    recommendation: str        # plain-English best-value recommendation
    reasoning: str             # step-by-step explanation tied to user criteria
    confidence: float          # 0.0 - 1.0
    caveats: list[str]
```

---

## Pipeline Flow (`core/pipeline.py`)

```
PDF files  +  ComparisonCriteria (from user)
   │                    │
   ▼                    │
┌──────────────┐        │
│  1. EXTRACT  │        │  pdfplumber: PDF → raw text
└──────┬───────┘        │
       │  list[str]     │
       ▼                │
┌──────────────┐        │
│  2. PARSE    │        │  LLM: raw text → ParsedQuote (one call per quote)
└──────┬───────┘        │
       │  list[ParsedQuote]
       ▼                │
┌──────────────┐        │
│  3. ANALYZE  │ ◄──────┘  LLM: ParsedQuotes + Criteria → QuoteAnalysis
└──────┬───────┘           (compare, detect hidden costs, score against criteria, recommend)
       │
       ▼
  QuoteAnalysis (JSON)
```

Three steps. One LLM call per quote (parse) + one analysis call (score against user criteria). Simple and deterministic.

### Step 1: Extract (`core/extractor.py`)
- Input: PDF file bytes
- Tool: `pdfplumber`
- Output: raw text string
- No LLM needed

### Step 2: Parse (`core/parser.py`)
- Input: raw text string
- Tool: LLM via OpenRouter with JSON structured output
- Prompt: "Extract structured quote data from this text. Return JSON matching this schema: {ParsedQuote.model_json_schema()}"
- Output: `ParsedQuote`

### Step 3: Analyze (`core/analyzer.py`)
- Input: `list[ParsedQuote]` + `ComparisonCriteria`
- Tool: LLM via OpenRouter with JSON structured output
- Prompt includes the user's criteria and instructions to:
  - Normalize categories across quotes
  - Detect items present in some quotes but missing in others (hidden costs)
  - Check `must_include` items — flag vendors missing them
  - Check `budget_limit` — flag vendors exceeding it
  - Score each quote weighted by `priorities` order
  - Rank and recommend with reasoning tied to the user's criteria
- Output: `QuoteAnalysis` (includes `criteria_used` so the user sees exactly what was scored against)

---

## LLM Client (`core/llm.py`)

Thin wrapper around the OpenAI SDK pointed at OpenRouter:

```python
from openai import OpenAI
import os

def get_client() -> OpenAI:
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

def get_model() -> str:
    return os.getenv("MODEL", "anthropic/claude-sonnet-4")
```

Swap models by changing the `MODEL` env var. No library beyond `openai`.

---

## FastAPI API (`main.py` + `api/routes.py`)

Two endpoints:

```
POST /quotes/analyze
  - Accepts: multipart/form-data
    - files: multiple PDF files
    - criteria: JSON string of ComparisonCriteria (optional)
  - Returns: QuoteAnalysis JSON

GET /health
  - Returns: {"status": "ok"}
```

---

## Typer CLI (`cli.py`)

```bash
# Basic usage
python cli.py analyze quote1.pdf quote2.pdf quote3.pdf

# With user-defined criteria
python cli.py analyze *.pdf --priorities "price,timeline,warranty"
python cli.py analyze *.pdf --priorities "price" --must-include "permits,insurance" --budget 50000

# Output options
python cli.py analyze *.pdf --format table   # pretty table (default)
python cli.py analyze *.pdf --format json    # raw JSON
```

Calls `pipeline.run()` directly — no server needed. CLI flags map to `ComparisonCriteria` fields.

---

## Dependencies (`requirements.txt`)

```
fastapi
uvicorn
python-multipart
pydantic
openai
pdfplumber
typer
rich           # pretty CLI tables
python-dotenv
```

---

## Track 2 Checklist

| Requirement | How we meet it |
|---|---|
| Scoring/ranking logic | `RankedQuote.score` (0-100) with pros/cons |
| Structured outputs | `QuoteAnalysis` Pydantic model → JSON/table/report |
| Explainability layer | `reasoning` field with step-by-step logic, `caveats` list |
| Error handling | Pydantic validation, try/except around LLM + PDF parsing |
| SDG alignment | SDG 8 — better procurement decisions for businesses |

---

## Files to Create

1. `quotematcher/core/models.py` — Pydantic models
2. `quotematcher/core/llm.py` — OpenRouter client
3. `quotematcher/core/extractor.py` — PDF text extraction
4. `quotematcher/core/parser.py` — LLM-based quote parsing
5. `quotematcher/core/analyzer.py` — LLM-based comparison & scoring
6. `quotematcher/core/pipeline.py` — Pipeline orchestrator
7. `quotematcher/api/routes.py` — FastAPI routes
8. `quotematcher/main.py` — FastAPI app
9. `quotematcher/cli.py` — Typer CLI
10. `quotematcher/requirements.txt`
11. `quotematcher/.env.example`

---

## Verification

1. **CLI test**: `python cli.py analyze sample1.pdf sample2.pdf` → should print comparison table
2. **API test**: `curl -X POST -F "files=@q1.pdf" -F "files=@q2.pdf" localhost:8000/quotes/analyze` → should return QuoteAnalysis JSON
3. **Model swap test**: Change `MODEL` env var, re-run → same output format, different LLM
