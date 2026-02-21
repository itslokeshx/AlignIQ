<div align="center">

# ⚡ AlignIQ

### Adaptive Career Alignment Intelligence

**A full-stack career intelligence platform that combines machine learning, live market data, and AI-generated insights to deliver a personalised career readiness report for every student — across every field.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3_70B-412991?style=for-the-badge)](https://groq.com)

</div>

---

## What is AlignIQ?

Most career tools give you a personality type and call it guidance. AlignIQ does something different.

It runs a **6-module assessment**, computes a **Career Readiness Index (CRI)** using a multi-dimensional formula, predicts your statistically optimal career via a **Random Forest ML model**, analyses your stated goal through a **dual-track comparison**, fetches **live job listings** from the Indian market, and generates a **personalised 3-phase roadmap** — all delivered as a single, cohesive intelligence report.

> Built for final-year students across **12 domains** and **192 career roles**. No field is out of scope.

---

## ✨ Features

| Feature                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| **6-Module Assessment**    | Identity, Interests, Experience, Skills, Intent, Personality       |
| **Career Readiness Index** | Composite score (0–100) across 4 weighted dimensions               |
| **ML Career Prediction**   | Random Forest Classifier — top 3 best-fit careers with match %     |
| **Dual-Track Analysis**    | Best Fit (Track A) vs Your Chosen Career (Track B) — side by side  |
| **Live Job Listings**      | Real Adzuna API jobs from India, ranked by your skill match        |
| **Market Intelligence**    | Explore demand trends by domain & role on a dedicated page         |
| **AI Executive Summary**   | Groq LLaMA 3 generates a personalised career intelligence overview |
| **3-Phase Roadmap**        | Specific, skill-gap-driven development plan across 9 months        |
| **Interactive Checklist**  | Tick off roadmap tasks with a live progress bar                    |
| **12 Domains / 192 Roles** | Technology, Business, Healthcare, Law, Design, Finance, and more   |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND  (Next.js 15)                   │
│  Hero → 6-Step Input Wizard → Loading → 8-Section Report     │
└─────────────────────┬────────────────────────────────────────┘
                      │  POST /api/analyze
                      ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND  (Flask API)                       │
│                                                              │
│  ┌─────────────────┐     ┌──────────────────────────────┐   │
│  │ Profile         │     │  ML Engine                   │   │
│  │ Processor       │────▶│  RandomForestClassifier      │   │
│  │                 │     │  → Top 3 best-fit careers    │   │
│  │ • Personality   │     └──────────────────────────────┘   │
│  │   scoring       │     ┌──────────────────────────────┐   │
│  │ • Interest      │────▶│  Market Engine               │   │
│  │   clusters      │     │  Adzuna API → live jobs      │   │
│  │ • Skill vectors │     │  + skill extraction          │   │
│  └────────┬────────┘     └──────────────────────────────┘   │
│           │              ┌──────────────────────────────┐   │
│           └─────────────▶│  CRI Calculator              │   │
│                          │  4-dimension composite score │   │
│                          └──────────────┬───────────────┘   │
│                                         │                    │
│                          ┌──────────────▼───────────────┐   │
│                          │  AI Engine (Groq LLaMA 3)    │   │
│                          │  Formats scores → prose text │   │
│                          └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧠 How the Intelligence Works

### Career Readiness Index (CRI)

The CRI is a composite score out of 100 built from four dimensions:

```
CRI = (Academic × 0.25) + (Skills × 0.30) + (Experience × 0.30) + (Market × 0.15)
```

| Dimension            | Weight | Formula                                                               |
| -------------------- | ------ | --------------------------------------------------------------------- |
| Academic Reliability | 25%    | `((CGPA/10) × 15) + consistency_bonus − backlog_penalty`              |
| Skill Depth          | 30%    | `(skills_count × 2) + (proficiency × 1.5) + (languages × 1)`          |
| Experience Adequacy  | 30%    | `(internships × 8) + (projects × 3) + competition/leadership bonuses` |
| Market Alignment     | 15%    | `(matched_market_skills / demanded_skills) × 15`                      |

### ML Career Prediction

- **Algorithm:** Random Forest Classifier (scikit-learn)
- **100 estimators**, max_depth=12, min_samples_split=5
- **Training data:** 1,200 synthetic student profiles across all domains
- **Features:** CGPA, backlogs, internships, projects, competitions, 5 personality scores, 5 interest cluster signals, skills count/breadth
- **Output:** 192 career roles → top 3 predictions with normalised match %

### Dual-Track Analysis

| Track                       | What it is                                                                 |
| --------------------------- | -------------------------------------------------------------------------- |
| **Track A — Best Fit**      | ML-predicted optimal career based purely on profile data                   |
| **Track B — Chosen Career** | Student's stated goal, analysed for alignment, skill gaps, and market data |

Alignment formula:

```
Alignment = (Interest Match × 0.40) + (Skill Match × 0.35) + (Experience Match × 0.25)
```

---

## 🗂️ Project Structure

```
AlignIQ/
├── backend/
│   ├── app.py                    # Flask app — 3 API routes
│   ├── requirements.txt
│   ├── data/
│   │   └── career_dataset.csv    # 1,200-sample ML training data
│   ├── model/
│   │   ├── __init__.py           # Model loader (joblib)
│   │   └── train_model.py        # Offline training script
│   └── modules/
│       ├── profile_processor.py  # Input normalisation + vectorisation
│       ├── cri_calculator.py     # CRI formula engine
│       ├── ai_engine.py          # Groq API wrapper (4 generation tasks)
│       └── market_engine.py      # Adzuna API client + job ranking
│
└── frontend/
    ├── app/
    │   ├── page.tsx              # Main SPA (hero/input/loading/results)
    │   ├── market/page.tsx       # Market Intelligence page
    │   └── methodology/page.tsx  # "How it works?" documentation
    ├── components/
    │   ├── layout/               # Navbar, Footer
    │   ├── input-modules/        # 6 assessment step components
    │   ├── results/              # 7 result section components
    │   └── ui/                   # shadcn/ui primitives
    └── lib/
        ├── types.ts              # All TypeScript type definitions
        ├── constants.ts          # 12 domains × 192 roles data
        └── utils.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- A **Groq API key** — [console.groq.com](https://console.groq.com)
- An **Adzuna API key** — [developer.adzuna.com](https://developer.adzuna.com)

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate          # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create environment file
cp .env.example .env
# Then edit .env with your keys (see below)

# 5. Train the ML model (first time only)
python model/train_model.py

# 6. Start the Flask server
python app.py
```

The backend will be running at **http://localhost:5000**

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# 4. Start the dev server
npm run dev
```

The frontend will be running at **http://localhost:3000**

---

### Environment Variables

**`backend/.env`**

```env
GROQ_API_KEY=your_groq_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔌 API Reference

### `POST /api/analyze`

Runs the full analysis pipeline. Returns a complete intelligence report.

**Request body:**

```json
{
  "identity": {
    "name": "Priya Sharma",
    "age": 22,
    "education_level": "Bachelor's",
    "field_of_study": "Computer Science",
    "cgpa": 8.2,
    "consistency": "High",
    "backlogs": 0
  },
  "interests": {
    "activities": ["coding", "designing"],
    "work_environments": ["startup", "remote"],
    "motivators": ["impact", "creativity"],
    "topics": ["AI", "product design"]
  },
  "experience": {
    "internships": 2,
    "projects": ["E-commerce app", "ML classifier"],
    "competitions": 1,
    "leadership": true,
    "leadership_desc": "Led a team of 4 in hackathon",
    "volunteer": false,
    "earned_from_skill": true,
    "earned_desc": "Freelance web dev",
    "readiness_rating": 7
  },
  "skills": {
    "selected_skills": ["Python", "React", "SQL"],
    "proficiency_rating": 7,
    "languages_known": ["Python", "JavaScript"]
  },
  "intent": {
    "target_domain": "Technology & Engineering",
    "target_role": "Full Stack Developer",
    "reasons": ["passion", "market demand"],
    "salary_expectation": "8-12 LPA",
    "work_location": "hybrid",
    "open_to_education": true
  },
  "personality": {
    "q1": "A",
    "q2": "B",
    "q3": "A",
    "q4": "A",
    "q5": "B",
    "q6": "A",
    "q7": "B",
    "q8": "A"
  }
}
```

**Response:**

```json
{
  "identity": { "name": "Priya Sharma", "field": "Computer Science" },
  "interest_profile": {
    "personality": { "analytical": 75, "creative": 60, ... },
    "interest_clusters": [{ "name": "Technical & Analytical", "strength": "strong" }],
    "motivators": ["impact", "creativity"]
  },
  "best_fit": {
    "role": "Full Stack Developer",
    "score": 82,
    "why": "...",
    "strengths": [...],
    "skills_to_develop": [...],
    "salary_range": "8–14 LPA",
    "second_fit": "Software Engineer",
    "third_fit": "Product Manager"
  },
  "chosen_career": {
    "role": "Full Stack Developer",
    "alignment_score": 78,
    "missing_skills": ["Docker", "System Design"],
    "roadmap": { "phase_1": "...", "phase_2": "...", "phase_3": "..." }
  },
  "cri": {
    "cri_total": 68,
    "academic_reliability_index": 18,
    "skill_depth_index": 22,
    "experience_adequacy_index": 21,
    "market_alignment_score": 7,
    "projected_cri": 84
  },
  "jobs": [
    { "title": "Full Stack Developer", "company": "Acme Corp", "location": "Bangalore", "apply_url": "...", "match_percentage": 65 }
  ],
  "executive_summary": "Priya demonstrates strong foundational alignment...",
  "action_checklist": ["Complete a Docker fundamentals course", ...]
}
```

---

### `GET /api/health`

Returns service status.

```json
{ "status": "ok", "version": "2.0", "timestamp": "2026-02-21T10:00:00Z" }
```

---

### `GET /api/market-trends?roles=Role1&roles=Role2`

Returns live job demand analysis for the specified roles.

```json
{
  "top_skills": [{ "skill": "Python", "count": 42 }, ...],
  "domain_competitiveness": { "Technology & Engineering": 87, ... },
  "analyzed_roles": ["Software Developer", "Data Analyst"]
}
```

---

## 📄 Pages

| Route          | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `/`            | Main SPA — Hero → Assessment Wizard → Loading → Intelligence Report |
| `/market`      | Market Intelligence — explore live skill demand by domain & role    |
| `/methodology` | Complete technical documentation — architecture, formulas, APIs     |

---

## 🛠️ Tech Stack

### Frontend

| Technology              | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| Next.js 15 (App Router) | Framework, routing, SSR/CSR                     |
| TypeScript 5            | Type safety across all components               |
| TailwindCSS v4          | Utility-first styling with custom design tokens |
| Framer Motion           | Page transitions, step animations, gauges       |
| Recharts                | Skill demand bar charts                         |
| shadcn/ui               | Base UI component primitives                    |

### Backend

| Technology             | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| Python 3.11 + Flask    | REST API server                              |
| scikit-learn           | Random Forest career prediction model        |
| pandas + numpy         | Data processing and ML feature engineering   |
| joblib                 | Model serialisation/deserialisation          |
| Groq SDK (LLaMA 3 70B) | AI text generation (presentation layer only) |
| Adzuna API             | Live job market data — India                 |
| python-dotenv          | Environment variable management              |

---

## 🧩 Key Design Decisions

**1. Single-page state machine, not multi-page routes**
All 6 assessment steps share state. A client-side state machine (`hero → input → loading → results`) keeps data in memory, prevents back-button issues mid-assessment, and enables instant animated transitions.

**2. AI is a presentation layer, not the analysis engine**
The LLM (Groq) only formats pre-computed numeric scores into readable prose. All intelligence — scores, rankings, skill gaps — is computed deterministically by Python. This makes the system auditable, reproducible, and trustworthy.

**3. Random Forest over deep learning**
Our 1,200-sample dataset is too small for deep learning. Random Forest performs excellently on small tabular data, provides interpretable feature importances, trains in seconds, and runs inference in microseconds — ideal for a web API.

**4. Dual-track career analysis**
Showing what the data recommends (Track A) alongside what the student wants (Track B) creates a productive, evidence-based conversation — validating good choices or surfacing misalignment without dismissing aspirations.

**5. Domain relevance gate for Adzuna**
Adzuna India is dominated by tech listings. A relevance gate (≥20% domain-expected skills in results) detects off-domain results and substitutes curated mock descriptions — ensuring market data is always meaningful.

---

## 🗺️ Roadmap

- [ ] User authentication + saved report history
- [ ] LinkedIn OAuth to auto-populate skills
- [ ] Real student dataset → retrain model with ground-truth data
- [ ] Course API integrations (Coursera, Udemy) in roadmap steps
- [ ] Mobile-native redesign with PWA support
- [ ] Multi-language support (Hindi, Tamil, Telugu)

---

## 📁 Training the ML Model

The model is pre-trained and included, but you can retrain it at any time:

```bash
cd backend
python model/train_model.py
```

This will:

1. Generate 1,200 synthetic student profiles across all 12 domains
2. Train a `RandomForestClassifier` with 100 estimators
3. Evaluate on a 20% holdout test set and print accuracy
4. Save the model as `model/career_model.pkl`

---

## 📝 License

This project is for academic and educational purposes.

---

<div align="center">

Built with 🔥 by the AlignIQ team

_Career intelligence for every student, every field._

</div>
