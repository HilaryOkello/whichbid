"""FastAPI application entrypoint."""

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="WhichBid",
    description="AI-powered vendor quote comparison and analysis for small businesses",
    version="1.0.0",
)

import os

# Enable CORS for frontend
# In production, set ALLOWED_ORIGINS env var (comma-separated)
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
