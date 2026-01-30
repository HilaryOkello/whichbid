"""OpenRouter LLM client wrapper."""

import os
from openai import OpenAI


def get_client() -> OpenAI:
    """Get an OpenAI client configured for OpenRouter."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY environment variable is required")

    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )


def get_model() -> str:
    """Get the model to use from environment or default."""
    return os.getenv("MODEL", "anthropic/claude-sonnet-4")
