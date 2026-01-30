"""Pydantic data models for WhichBid."""

from pydantic import BaseModel, Field


class ComparisonCriteria(BaseModel):
    """User-provided rubric for how to evaluate quotes."""
    priorities: list[str] = Field(
        default_factory=lambda: ["price"],
        description="Ordered by importance, e.g. ['price', 'timeline', 'warranty']"
    )
    must_include: list[str] | None = Field(
        default=None,
        description="Required items, e.g. ['permits', 'insurance']"
    )
    budget_limit: float | None = Field(
        default=None,
        description="Max acceptable total"
    )
    notes: str | None = Field(
        default=None,
        description="Free-text context, e.g. 'We need this done before March'"
    )


class QuoteLineItem(BaseModel):
    """A single line item from a quote."""
    description: str
    category: str = Field(
        description="One of: labor, materials, permits, equipment, other"
    )
    quantity: float | None = None
    unit_price: float | None = None
    total: float


class ParsedQuote(BaseModel):
    """Structured representation of a vendor quote."""
    vendor_name: str
    quote_date: str | None = None
    valid_until: str | None = None
    line_items: list[QuoteLineItem]
    subtotal: float
    tax: float | None = None
    total: float
    payment_terms: str | None = None
    timeline: str | None = None
    notes: str | None = None


class HiddenCost(BaseModel):
    """A potential hidden cost detected during analysis."""
    vendor: str
    item: str
    estimated_amount: float
    reason: str = Field(description="Why this is flagged as a hidden cost")


class RankedQuote(BaseModel):
    """A quote with its score and evaluation."""
    vendor: str
    base_price: float
    true_total: float = Field(description="Base price + estimated hidden costs")
    score: float = Field(ge=0, le=100, description="Score from 0-100 based on criteria")
    pros: list[str]
    cons: list[str]


class QuoteAnalysis(BaseModel):
    """The final output - the standard format businesses consume."""
    criteria_used: ComparisonCriteria = Field(
        description="Echo back what the agent scored against"
    )
    quotes: list[ParsedQuote]
    normalized_categories: list[str]
    hidden_costs: list[HiddenCost]
    ranking: list[RankedQuote]
    recommendation: str = Field(description="Plain-English best-value recommendation")
    reasoning: str = Field(description="Step-by-step explanation tied to user criteria")
    confidence: float = Field(ge=0, le=1, description="Confidence score 0.0-1.0")
    caveats: list[str]