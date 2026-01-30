# WhichBid

An AI agent that helps small businesses analyse and compare quotes from different vendors.

## Prerequisites

- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation)
- Node.js 18+
- npm

## Backend Setup

```bash
cd whichbid

# Install dependencies
poetry install

# Configure environment
cp .env.example .env
# Edit .env and add your OpenRouter API key

# Run the server
poetry run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Frontend Setup

```bash
cd whichbid-ui

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The UI will be available at `http://localhost:3000`.

## Project Structure

```
whichbid/          # Backend — Python, FastAPI, Poetry
whichbid-ui/       # Frontend — Next.js, React, TypeScript, Tailwind CSS
```
