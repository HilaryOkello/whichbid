<p align="center">
  <img src="whichbid-ui/public/logo.png" alt="WhichBid Logo" width="400">
</p>

<h3 align="center">🤖 AI-Powered Quote Comparison for Smarter Procurement</h3>

<p align="center">
  <strong>Upload vendor quotes → Get instant AI analysis → Make confident decisions</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/AI-OpenRouter-blue?style=flat-square" alt="AI">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## 🎯 What is WhichBid?

WhichBid is an **AI agent** that helps small businesses analyze and compare vendor quotes instantly. No more spreadsheets or manual calculations—just upload your quotes and let AI do the work.

## 💡 Why WhichBid?

| Problem | Solution |
|---------|----------|
| Comparing quotes is time-consuming | AI analyzes in seconds |
| Hidden costs are easy to miss | AI detects hidden fees automatically |
| Decision-making is subjective | Data-driven recommendations with scores |

## ⚡ Quick Start

```bash
# Backend (Terminal 1)
cd whichbid && poetry install && cp .env.example .env
# Add your OpenRouter API key to .env
poetry run uvicorn main:app --reload

# Frontend (Terminal 2)
cd whichbid-ui && npm install && npm run dev
```

**Open** → [localhost:3000](http://localhost:3000)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Multi-Quote Analysis** | Upload 2+ PDF/DOCX quotes for comparison |
| 🏆 **Smart Ranking** | AI scores vendors (0-100) based on your priorities |
| ⚠️ **Hidden Cost Detection** | Automatically finds fees buried in fine print |
| 📊 **Savings Dashboard** | Animated metrics show potential savings at a glance |
| 📜 **Analysis History** | Revisit past comparisons stored locally |
| 🌓 **Dark/Light Mode** | Toggle theme with one click |
| 📋 **Quick Share** | Copy professional summary to share with stakeholders |
| 📥 **PDF Export** | Download detailed analysis reports |

---

## 🧪 Test the Features

1. **Upload** → Drag 2-3 sample quote PDFs
2. **Customize** → Set priorities (price, timeline, quality)
3. **Analyze** → Click "Compare Quotes" and watch the magic
4. **Explore Results** → Check the Savings Dashboard metrics
5. **Share** → Click "Share Summary" to copy results
6. **Toggle Theme** → Try the sun/moon button in header
7. **View History** → Run another analysis, then check History dropdown

---

## 🛠️ Tech Stack

```
Frontend  →  Next.js 16 • React • TypeScript • Tailwind CSS
Backend   →  Python • FastAPI • Poetry
AI        →  OpenRouter API (Claude/GPT models)
```

## 📁 Project Structure

```
whichbid/          # Backend API
whichbid-ui/       # Frontend App
```

---

<p align="center">
  <sub>Built with ❤️ for the AI Hackathon 2026</sub>
</p>
