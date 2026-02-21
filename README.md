<div align="center">

# ⚡ AlignIQ

### Adaptive Career Alignment Intelligence

**A full-stack career intelligence platform that combines machine learning, live market data, and AI-generated insights to deliver a personalised career readiness report for every student — across every field.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3_70B-412991?style=for-the-badge)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)

</div>

---

## What is AlignIQ?

Most career tools give you a personality type and call it guidance. AlignIQ does something different.

It runs a **6-module assessment**, computes a **Career Readiness Index (CRI)** using a multi-dimensional formula, predicts your statistically optimal career via a **Random Forest ML model**, analyses your stated goal through a **dual-track comparison**, fetches **live job listings** from the Indian market, and generates a **personalised 3-phase roadmap with curated learning resources** — all delivered as a single, cohesive 3-act intelligence report.

> Built for final-year students across **12 domains** and **192 career roles**. No field is out of scope.

---

## ✨ Features

| Feature                        | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| **6-Module Assessment**        | Identity, Interests, Experience, Skills, Intent, Personality             |
| **Career Readiness Index**     | Composite score (0–100) across 4 weighted dimensions                     |
| **ML Career Prediction**       | Random Forest Classifier — top 3 best-fit careers with match %           |
| **Dual-Track Analysis**        | Best Fit (Track A) vs Your Chosen Career (Track B) — side by side        |
| **3-Act Intelligence Report**  | Profile snapshot → Career analysis → 90-day action path                  |
| **Live Job Listings**          | Real Adzuna API jobs from India, ranked by your skill match              |
| **Market Intelligence**        | Explore demand trends by domain & role on a dedicated page               |
| **AI Executive Summary**       | Groq LLaMA 3 generates a personalised career intelligence overview       |
| **Curated Learning Resources** | 241-skill resource map with YouTube, Udemy, Coursera links per skill gap |
| **YouTube API Integration**    | Dynamic video resources via YouTube Data API v3 for skill gaps           |
| **3-Phase Roadmap**            | Skill-gap-driven development plan enriched with real learning resources  |
| **Interactive Checklist**      | Tick off roadmap tasks with a live progress bar                          |
| **12 Domains / 192 Roles**     | Technology, Business, Healthcare, Law, Design, Finance, and more         |
| **Keep-Alive Backend**         | Self-pinging mechanism to prevent Render free-tier sleep                 |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              FRONTEND  (Next.js 16 — Vercel)                 │
│  Hero → 6-Step Input Wizard → Loading → 3-Act Report         │
│  Act I: Profile  |  Act II: Analysis  |  Act III: Action     │
└─────────────────────┬────────────────────────────────────────┘
                      │  POST /api/analyze
                      ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND  (Flask + Gunicorn — Render)           │
│                                                              │
│  ┌─────────────────┐     ┌──────────────────────────────┐   │
│  │ Profile         │     │  ML Engine                   │   │
│  │ Processor       │────▶│  RandomForestClassifier      │   │
│  │                 │     │  → Top 3 best-fit careers    │   │
│  │ • Personality   │     └──────────────────────────────┘   │
│  │   scoring       │     ┌──────────────────────────────┐   │
│  │ • Interest      │────▶│  Market Engine               │   │
│  │   clusters      │     │  Adzuna API → live jobs      │   │
│  │ • Skill vectors │     │  180+ role→domain hints      │   │
│  └────────┬────────┘     └──────────────────────────────┘   │
│           │              ┌──────────────────────────────┐   │
│           └─────────────▶│  CRI Calculator              │   │
│                          │  4-dimension composite score │   │
│                          └──────────────┬───────────────┘   │
│                                         │                    │
│                          ┌──────────────▼───────────────┐   │
│                          │  AI Engine (Groq LLaMA 3)    │   │
│                          │  Formats scores → prose text │   │
│                          └──────────────┬───────────────┘   │
│                                         │                    │
│                          ┌──────────────▼───────────────┐   │
│                          │  Resource Map                │   │
│                          │  241 skills → YouTube/Udemy  │   │
│                          │  curated learning links      │   │
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

### Resource Map Engine

- **241 skill keywords** mapped to curated learning resources
- **YouTube Data API v3** integration for dynamic video results per skill
- **Smart matching:** exact → partial → domain fallback chain
- **Platforms covered:** YouTube, Udemy, Coursera, LinkedIn Learning, edX, Khan Academy
- **Each roadmap action** is enriched with 2–4 platform-specific resource links

### Market Analysis Accuracy

- **180+ role → domain hints** ensure correct domain context for all 192 roles
- **20+ role-specific mock descriptions** for fields underrepresented in Adzuna India (Creative, Trades, Healthcare)
- Frontend sends `domain` param → backend locks correct skill context
- Domain relevance gate detects off-domain results and substitutes curated mocks

---

## 🗂️ Project Structure

```
AlignIQ/
├── backend/
│   ├── app.py                    # Flask app — 3 API routes + keep-alive thread
│   ├── requirements.txt          # Flask, gunicorn, scikit-learn, groq, etc.
│   ├── render.yaml               # Render.com deployment blueprint
│   ├── .env.example              # All required environment variables
│   ├── data/
│   │   └── career_dataset.csv    # 1,200-sample ML training data
│   ├── model/
│   │   ├── __init__.py           # Model loader (joblib)
│   │   └── train_model.py        # Offline training script
│   └── modules/
│       ├── profile_processor.py  # Input normalisation + vectorisation
│       ├── cri_calculator.py     # CRI formula engine
│       ├── ai_engine.py          # Groq API wrapper (4 generation tasks)
│       ├── market_engine.py      # Adzuna API + 180 role hints + mock data
│       └── resource_map.py       # 241-skill resource map + YouTube API
│
└── frontend/
    ├── .env.example              # NEXT_PUBLIC_API_URL template
    ├── app/
    │   ├── page.tsx              # Main SPA (hero/input/loading/results)
    │   ├── market/page.tsx       # Market Intelligence page
    │   └── methodology/page.tsx  # Technical documentation (18 sections)
    ├── components/
    │   ├── layout/               # Navbar, Footer (minimal)
    │   ├── input-modules/        # 6 assessment step components
    │   ├── results/              # 3-act report components
    │   │   ├── act-one-profile.tsx
    │   │   ├── act-two-analysis.tsx
    │   │   ├── act-three-path.tsx
    │   │   ├── ai-executive-summary.tsx
    │   │   ├── execution-roadmap.tsx
    │   │   └── job-opportunities.tsx
    │   └── ui/                   # shadcn/ui primitives
    └── lib/
        ├── types.ts              # All TypeScript type definitions
        ├── constants.ts          # 12 domains × 192 roles data
        └── utils.ts
```

---

## 🚀 Getting Started (Local)

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- A **Groq API key** — [console.groq.com](https://console.groq.com)
- An **Adzuna API key** — [developer.adzuna.com](https://developer.adzuna.com)
- A **YouTube Data API v3 key** — [console.cloud.google.com](https://console.cloud.google.com) _(optional but recommended)_

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
# Edit .env and fill in your keys

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
cp .env.example .env.local
# Or manually: echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# 4. Start the dev server
npm run dev
```

The frontend will be running at **http://localhost:3000**

---

### Environment Variables

**`backend/.env`**

```env
GROQ_API_KEY=your_groq_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
YOUTUBE_API_KEY=your_youtube_data_api_v3_key   # optional
FLASK_ENV=development

# Set automatically by Render on deployment:
# RENDER_EXTERNAL_URL=https://aligniq-backend.onrender.com
# FRONTEND_URL=https://aligniq.vercel.app
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# Production: NEXT_PUBLIC_API_URL=https://aligniq-backend.onrender.com
```

---

## ☁️ Deployment

AlignIQ is deployed with:

- **Frontend** → [Vercel](https://vercel.com) (automatic from GitHub)
- **Backend** → [Render](https://render.com) (web service via `render.yaml`)

### Deploy Frontend to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** → `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` → your Render backend URL
5. Deploy — Vercel handles build automatically

### Deploy Backend to Render

1. Push to GitHub (ensure `backend/render.yaml` is committed)
2. Go to [render.com](https://render.com) → **New + → Web Service**
3. Connect your GitHub repo
4. Configure:

| Setting            | Value                                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Root Directory** | `backend`                                                         |
| **Build Command**  | `pip install -r requirements.txt`                                 |
| **Start Command**  | `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
| **Plan**           | Free                                                              |

5. Add **Environment Variables** in Render dashboard:

| Key               | Value                         |
| ----------------- | ----------------------------- |
| `GROQ_API_KEY`    | your Groq key                 |
| `ADZUNA_APP_ID`   | your Adzuna app ID            |
| `ADZUNA_APP_KEY`  | your Adzuna app key           |
| `YOUTUBE_API_KEY` | your YouTube Data API v3 key  |
| `FLASK_ENV`       | `production`                  |
| `FRONTEND_URL`    | `https://your-app.vercel.app` |

6. Deploy. Your backend URL: `https://aligniq-backend.onrender.com`
7. Test: `GET https://aligniq-backend.onrender.com/api/health`

> **Keep-Alive:** The backend automatically pings `/api/health` every 14 minutes via a daemon thread, preventing Render free-tier spin-down. No external cron service needed.

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

**Response includes:** `identity`, `interest_profile`, `best_fit`, `chosen_career`, `cri`, `jobs`, `executive_summary`, `action_checklist`, enriched `roadmap` with resource links per skill gap.

---

### `GET /api/health`

Returns service status.

```json
{ "status": "ok", "version": "2.0", "timestamp": "2026-02-21T10:00:00Z" }
```

---

### `GET /api/market-trends?roles=Role1&roles=Role2&domain=Domain`

Returns live job demand analysis for the specified roles. The `domain` param ensures accurate skill context for non-tech roles.

```json
{
  "top_skills": [["Python", 42], ["React", 38], ...],
  "domain_competitiveness": { "Technology & Engineering": 87 },
  "analyzed_roles": ["Software Developer", "Data Analyst"]
}
```

---

## 📄 Pages

| Route          | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `/`            | Main SPA — Hero → Assessment Wizard → Loading → 3-Act Report     |
| `/market`      | Market Intelligence — explore live skill demand by domain & role |
| `/methodology` | Complete technical documentation — architecture, formulas, APIs  |

---

## 🛠️ Tech Stack

### Frontend

| Technology              | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| Next.js 16 (App Router) | Framework, routing, SSR/CSR                     |
| TypeScript 5            | Type safety across all components               |
| TailwindCSS v4          | Utility-first styling with custom design tokens |
| Framer Motion           | Page transitions, step animations, gauges       |
| Recharts                | Skill demand bar charts                         |
| shadcn/ui               | Base UI component primitives                    |

### Backend

| Technology             | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| Python 3.11 + Flask    | REST API server                                 |
| Gunicorn               | Production WSGI server (Render deployment)      |
| scikit-learn           | Random Forest career prediction model           |
| pandas + numpy         | Data processing and ML feature engineering      |
| joblib                 | Model serialisation/deserialisation             |
| Groq SDK (LLaMA 3 70B) | AI text generation (presentation layer only)    |
| Adzuna API             | Live job market data — India                    |
| YouTube Data API v3    | Dynamic video learning resources for skill gaps |
| python-dotenv          | Environment variable management                 |

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

**5. Domain-aware market engine**
Adzuna India is dominated by tech listings. The market engine uses 180+ role → domain hints and 20+ role-specific mock templates to ensure Wedding Planners don't see "Music Theory" as their top skill demand.

**6. Resource map over static links**
A 241-keyword smart matching engine (exact → partial → domain fallback) enriches every roadmap action with real platform links. YouTube API v3 makes video resources dynamic and always current.

**7. Self-healing keep-alive on Render**
A daemon thread pings the backend's own `/api/health` every 14 minutes. Render's free tier spins down after 15 minutes of inactivity — this prevents that without any external cron or paid tier.

---

## 🗺️ Roadmap

- [ ] User authentication + saved report history
- [ ] LinkedIn OAuth to auto-populate skills
- [ ] Real student dataset → retrain model with ground-truth data
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile-native PWA support
- [ ] PDF export of intelligence report

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
