"""FastAPI route definitions."""

import json
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from core.models import ComparisonCriteria, QuoteAnalysis
from core.pipeline import run_from_bytes

router = APIRouter()


@router.post("/quotes/analyze", response_model=QuoteAnalysis)
async def analyze_quotes(
    files: Annotated[list[UploadFile], File(description="PDF quote files to analyze")],
    criteria: Annotated[str | None, Form(description="JSON string of ComparisonCriteria")] = None,
) -> QuoteAnalysis:
    """
    Analyze and compare vendor quotes.

    Accepts multiple PDF files and optional comparison criteria.
    Returns a comprehensive analysis with rankings and recommendations.
    """
    if not files:
        raise HTTPException(status_code=400, detail="At least one PDF file is required")

    # Validate file types
    for f in files:
        if not f.filename or not f.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"File '{f.filename}' is not a PDF"
            )

    # Parse criteria if provided
    parsed_criteria: ComparisonCriteria | None = None
    if criteria:
        try:
            criteria_data = json.loads(criteria)
            parsed_criteria = ComparisonCriteria.model_validate(criteria_data)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid criteria JSON: {e}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid criteria format: {e}"
            )

    # Read all PDF bytes
    try:
        pdf_bytes_list = [await f.read() for f in files]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read uploaded files: {e}"
        )

    # Run the pipeline
    try:
        analysis = run_from_bytes(pdf_bytes_list, parsed_criteria)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {e}"
        )


@router.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
