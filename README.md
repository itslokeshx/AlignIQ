<div align="center">

# ⚡ AlignIQ

### Adaptive Career Alignment Intelligence

**A full-stack career intelligence platform that fuses machine learning, real-time labour-market data, large-language-model prose generation, and a curated learning-resource engine to deliver a personalised, quantified career readiness report — for every student, in every field.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3_70B-412991?style=for-the-badge)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)

[Live Demo — align-iq-eight.vercel.app](https://align-iq-eight.vercel.app)

</div>

---

## Table of Contents

1. [Abstract](#abstract)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [Feature Matrix](#-feature-matrix)
5. [System Architecture](#-system-architecture)
6. [Pipeline Execution Flow](#-pipeline-execution-flow)
7. [Data Collection — 4-Step Assessment](#-data-collection--4-step-assessment)
8. [Intelligence Engine — Backend Modules](#-intelligence-engine--backend-modules)
   - [Profile Processor](#81-profile-processor)
   - [ML Career Prediction Engine](#82-ml-career-prediction-engine)
   - [Career Readiness Index (CRI)](#83-career-readiness-index-cri)
   - [Market Engine — Adzuna API](#84-market-engine--adzuna-api)
   - [AI Text Generation — Groq / LLaMA 3](#85-ai-text-generation--groq--llama-3)
   - [Resource Map Engine](#86-resource-map-engine)
9. [Dual-Track Career Analysis](#-dual-track-career-analysis)
10. [3-Act Intelligence Report](#-3-act-intelligence-report)
11. [Performance Architecture — Parallelisation](#-performance-architecture--parallelisation)
12. [Frontend Architecture](#-frontend-architecture)
13. [API Reference](#-api-reference)
14. [Data Models & Type System](#-data-models--type-system)
15. [Complete Technology Stack](#-complete-technology-stack)
16. [Project Structure](#-project-structure)
17. [Getting Started — Local Development](#-getting-started--local-development)
18. [Deployment Guide](#-deployment-guide)
19. [Key Design Decisions](#-key-design-decisions)
20. [Limitations & Future Work](#-limitations--future-work)
21. [Quick Reference — Numbers That Matter](#-quick-reference--numbers-that-matter)
22. [License](#-license)

---

## Abstract

Career guidance in India remains largely anecdotal — driven by parental advice, peer imitation, or surface-level personality quizzes. None of the existing tools quantify career readiness, perform real-time market validation, or generate field-specific, actionable roadmaps.

**AlignIQ** addresses this gap through a **multi-module intelligence pipeline** that:

1. Collects structured student data via a **4-step streamlined assessment**
2. Computes a **Career Readiness Index (CRI)** across 4 weighted dimensions
3. Predicts the statistically optimal career using a **Random Forest ML model** trained on 1,200 profiles
4. Performs a **dual-track comparison** — ML-recommended career vs the student's stated goal
5. Fetches **live job market data** from the Adzuna API (India endpoint)
6. Generates **professional prose insights** via Groq LLaMA 3 70B (presentation layer only)
7. Enriches a **3-phase skill-gap roadmap** with curated learning resources from a **241-skill resource map** powered by the **YouTube Data API v3**
8. Delivers everything as a cohesive **3-act intelligence report** with premium glass-morphism UI

The system covers **12 academic domains** and **192 career roles** — from Software Engineer to Wedding Planner, Neurosurgeon to Sound Designer. No field is out of scope.

> **Performance**: The entire pipeline executes in **~8–12 seconds** (down from ~30s) through aggressive parallelisation using Python's `concurrent.futures.ThreadPoolExecutor`.

---

## Problem Statement

Students face a critical, multi-dimensional gap between academic training, personal aptitude, and job market reality:

| Problem                                              | Impact                                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Career decisions driven by social pressure, not data | Students enter fields with poor personal alignment, leading to dissatisfaction and attrition      |
| No visibility into real-time skill demand            | Students invest years learning skills that may be declining in market value                       |
| No quantified career readiness metric                | "Am I ready?" is never answered with a number — only vague reassurance                            |
| Generic personality-type career tools                | A 4-letter type cannot capture skills, experience, market context, or domain-specific readiness   |
| No field-agnostic guidance platform                  | Tech-focused tools ignore 80% of students in arts, law, healthcare, trades, education, sports     |
| No actionable, personalised skill-gap roadmap        | Students know they have gaps but not _which_ skills, _what_ resources, or _how long_ it will take |
| Static resource recommendations                      | Links go stale; no dynamic content tied to current skill demand                                   |

**AlignIQ solves every one of these** by combining deterministic scoring, ML prediction, live market data, LLM prose generation, and a curated resource engine into a single, cohesive pipeline.

---

## Proposed Solution

AlignIQ implements a **7-stage modular pipeline** where each stage produces structured data consumed by the next:

```
Student Input → Profile Processing → ML Prediction + Market Fetch → CRI Scoring
    → AI Text Generation → Resource Enrichment → 3-Act Report Delivery
```

**Key design principle**: The AI (Groq LLaMA 3) is a **presentation layer only**. All scores, rankings, skill gaps, and alignment metrics are computed **deterministically** by Python. The LLM only formats pre-computed data into readable prose. This makes the system **auditable, reproducible, and trustworthy** for high-stakes career decisions.

---

## ✨ Feature Matrix

| #   | Feature                           | Description                                                                                                        | Technology                                     |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 1   | **4-Step Streamlined Assessment** | Academic → Experience & Skills → Career Goal → Personality                                                         | React state machine, TypeScript interfaces     |
| 2   | **Career Readiness Index (CRI)**  | Composite score (0–100) across 4 weighted dimensions: Academic (25%), Skills (30%), Experience (30%), Market (15%) | `cri_calculator.py` — deterministic formula    |
| 3   | **ML Career Prediction**          | Random Forest Classifier → top 3 best-fit careers with normalised match %                                          | scikit-learn, 1,200-sample training set        |
| 4   | **Dual-Track Analysis**           | Track A (ML Best Fit) vs Track B (Student's Chosen Career) — side-by-side evidence-based comparison                | Profile processor + alignment formula          |
| 5   | **3-Act Intelligence Report**     | Act I: Profile Snapshot → Act II: Career Analysis → Act III: 90-Day Action Path                                    | Premium glass-morphism UI, Framer Motion       |
| 6   | **Live Job Listings**             | Real Adzuna API jobs from India, ranked by student skill match, with contextual match labels                       | `market_engine.py` + 180+ role→domain hints    |
| 7   | **Market Intelligence Page**      | Standalone tool to explore live skill demand by domain & role — independent of assessment                          | `/market` route, Recharts bar charts           |
| 8   | **AI Executive Summary**          | Groq LLaMA 3 70B generates a personalised career intelligence overview from pre-computed scores                    | `ai_engine.py` — temperature 0.4               |
| 9   | **241-Skill Resource Map**        | Smart matching engine (exact → partial → domain fallback) maps skill gaps to curated learning links                | `resource_map.py` — 241 keyword entries        |
| 10  | **YouTube API Integration**       | Dynamic video resources via YouTube Data API v3 for every skill gap in the roadmap                                 | Parallel API calls, up to 8 workers            |
| 11  | **3-Phase Personalised Roadmap**  | Skill-gap-driven development plan (Foundation → Expansion → Market-Ready) enriched with real resources             | LLM-generated phases + resource enrichment     |
| 12  | **Interactive Action Checklist**  | Tick off roadmap tasks with a live progress bar and completion celebrations                                        | Client-side state, Framer Motion               |
| 13  | **Premium Glass-Morphism UI**     | Animated CRI ring, gradient career cards, bidirectional personality spectrum bars, glass panels                    | TailwindCSS v4, CSS backdrop-blur              |
| 14  | **Mobile-Responsive Design**      | Full responsive layout with xs breakpoint (475px), touch-optimised inputs, stacked layouts                         | TailwindCSS responsive utilities               |
| 15  | **Parallelised Backend**          | 2-phase ThreadPoolExecutor architecture — ~8–12s total (3× faster than sequential)                                 | `concurrent.futures`, up to 4 workers/phase    |
| 16  | **12 Domains / 192 Roles**        | Technology, Business, Creative, Science, Healthcare, Law, Education, Media, Finance, Arts, Sports, Trades          | `constants.ts` — comprehensive role mapping    |
| 17  | **Domain-Aware Market Engine**    | 180+ role→domain hints + 20+ mock templates for underrepresented fields in Adzuna India                            | Relevance gate with 20% domain-skill threshold |
| 18  | **Keep-Alive Daemon**             | Self-pinging thread prevents Render free-tier spin-down (14-min interval)                                          | `threading.Thread(daemon=True)`                |
| 19  | **Bridge Sentence**               | AI-generated transitional insight connecting Track A and Track B findings                                          | LLM prompt with personality context            |
| 20  | **Projected CRI**                 | Simulated score showing career readiness ceiling if all skill gaps are closed                                      | CRI recalculation with gap closure             |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                FRONTEND  (Next.js 16 — Vercel)                   │
│                                                                  │
│  Hero → 4-Step Assessment → Loading → 3-Act Report               │
│                                                                  │
│  Act I: Profile Snapshot   (glass summary + personality spectra) │
│  Act II: Career Analysis   (CRI ring + dual-track cards)         │
│  Act III: Action Path      (roadmap + checklist + jobs)          │
│                                                                  │
│  Standalone: /market (Market Intelligence) · /methodology (Docs) │
└─────────────────────┬────────────────────────────────────────────┘
                      │  POST /api/analyze  (JSON payload)
                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                BACKEND  (Flask + Gunicorn — Render)               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Stage 1: Profile Processor (sync — all stages depend)   │    │
│  │  • Personality scoring (8 Q → 5 dimensions)              │    │
│  │  • Interest cluster detection (5 clusters)               │    │
│  │  • Skill vector construction                             │    │
│  │  • Domain detection via 100+ keyword lookup              │    │
│  └────────────────────────┬─────────────────────────────────┘    │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐    │
│  │  Stage 2 — PHASE A (parallel, 4 workers)                 │    │
│  │  ┌────────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐  │    │
│  │  │ ML Predict │ │ Adzuna   │ │  CRI   │ │ Role Desc  │  │    │
│  │  │ Top 3 fits │ │ Jobs API │ │ Score  │ │ (Groq LLM) │  │    │
│  │  └────────────┘ └──────────┘ └────────┘ └────────────┘  │    │
│  └────────────────────────┬─────────────────────────────────┘    │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐    │
│  │  Stage 3 — PHASE B (parallel, 4 workers)                 │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │    │
│  │  │ Roadmap  │ │ Bridge   │ │ Summary  │ │ Checklist  │  │    │
│  │  │ (LLM)   │ │ (LLM)    │ │ (LLM)    │ │ (LLM)      │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │    │
│  └────────────────────────┬─────────────────────────────────┘    │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐    │
│  │  Stage 4: Resource Enrichment (parallel YouTube calls)   │    │
│  │  241-skill map → curated links + YouTube Data API v3     │    │
│  └────────────────────────┬─────────────────────────────────┘    │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐    │
│  │  Stage 5: Response Assembly → JSON → Frontend            │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Pipeline Execution Flow

The `/api/analyze` endpoint executes a **5-stage pipeline** with strategic parallelisation:

| Stage | Name                      | Execution                      | Duration | What Happens                                                                                     |
| ----- | ------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------ |
| 1     | Profile Processing        | **Sequential**                 | ~50ms    | Parse input, score personality, detect clusters, build skill vectors, detect domain              |
| 2     | Phase A — Compute & Fetch | **Parallel (4 workers)**       | ~3–4s    | ML prediction + Adzuna job fetch + CRI calculation + role description (LLM) — all simultaneously |
| 3     | Phase B — LLM Generation  | **Parallel (4 workers)**       | ~3–5s    | Roadmap + bridge sentence + executive summary + action checklist — 4 Groq calls simultaneously   |
| 4     | Resource Enrichment       | **Parallel (up to 9 workers)** | ~1–2s    | YouTube Data API v3 calls for each roadmap skill — all simultaneously via ThreadPoolExecutor     |
| 5     | Response Assembly         | **Sequential**                 | ~10ms    | Combine all results into final JSON response                                                     |

**Total: ~8–12 seconds** (down from ~30s sequential execution — a **3× performance improvement**).

---

## 📝 Data Collection — 4-Step Assessment

The assessment collects student data through a **streamlined 4-step wizard** (consolidated from an earlier 6-step flow for better UX and lower abandonment):

### Step 1 — Academic Profile

| Field            | Type                          | Description                                                 |
| ---------------- | ----------------------------- | ----------------------------------------------------------- |
| `name`           | string                        | Student's full name                                         |
| `field_of_study` | string                        | Academic discipline (e.g. "Computer Science", "Psychology") |
| `cgpa`           | number                        | Cumulative GPA on a 10-point scale                          |
| `consistency`    | `"low" \| "medium" \| "high"` | Academic consistency self-assessment                        |
| `backlogs`       | number                        | Number of active backlogs                                   |

### Step 2 — Experience & Skills (Merged)

| Field                | Type          | Description                                       |
| -------------------- | ------------- | ------------------------------------------------- |
| `selected_skills`    | string[]      | Skills selected from a categorised 241-skill list |
| `proficiency_rating` | number (1–10) | Self-rated overall skill proficiency              |
| `languages_known`    | string[]      | Programming / technical languages                 |
| `internships`        | number        | Count of completed internships                    |
| `projects`           | number        | Count of completed projects                       |
| `leadership`         | boolean       | Has held a leadership role                        |
| `competitions`       | boolean       | Has participated in competitions                  |
| `volunteer`          | boolean       | Has done volunteer work                           |
| `earned_from_skill`  | boolean       | Has earned money from skills                      |
| `readiness_rating`   | number (1–10) | Self-rated job readiness                          |

### Step 3 — Career Goal (Merged Intent + Interests)

| Field           | Type     | Description                                               |
| --------------- | -------- | --------------------------------------------------------- |
| `target_domain` | string   | One of 12 career domains                                  |
| `target_role`   | string   | Specific role within the domain (from 192 roles)          |
| `activities`    | string[] | Activities the student enjoys (maps to interest clusters) |

### Step 4 — Personality

| Field     | Type                         | Description                                                      |
| --------- | ---------------------------- | ---------------------------------------------------------------- |
| `answers` | `Record<string, "A" \| "B">` | 8 forced-choice A/B questions → 5 bipolar personality dimensions |

**Personality Dimensions Mapped:**

| Dimension                   | Pole A                             | Pole B                                    |
| --------------------------- | ---------------------------------- | ----------------------------------------- |
| Analytical ↔ Creative       | Logical, data-driven thinking      | Imaginative, design-oriented thinking     |
| Independent ↔ Collaborative | Prefers solo deep work             | Thrives in team environments              |
| Theoretical ↔ Practical     | Conceptual, abstract learning      | Applied, hands-on learning                |
| Stable ↔ Adaptive           | Prefers routine and predictability | Thrives in dynamic, changing environments |
| Specialist ↔ Generalist     | Deep expertise in one domain       | Broad knowledge across many areas         |

---

## 🧠 Intelligence Engine — Backend Modules

### 8.1 Profile Processor

**File:** `backend/modules/profile_processor.py`

The first computation stage. Transforms raw form data into a structured, machine-readable format consumed by all downstream modules.

**Processing Pipeline:**

1. Extract and validate all 4 input step fields from the POST body
2. Compute 5 personality dimension scores (0–100 each) from 8 A/B answers
3. Map selected activities to 5 interest clusters with signal strength (`strong` / `moderate` / `emerging`)
4. Build skill vector — total count, category breakdown, normalised breadth score
5. Detect target domain from role name using 100+ keyword-to-domain lookup table
6. Compute career alignment vectors for matching chosen role to profile
7. Return a single flat `processed` dictionary used by all downstream modules

### 8.2 ML Career Prediction Engine

**File:** `backend/model/train_model.py` (training) · `backend/model/__init__.py` (inference)

| Parameter          | Value                                   |
| ------------------ | --------------------------------------- |
| Algorithm          | `RandomForestClassifier` (scikit-learn) |
| Estimators         | 100 decision trees                      |
| Max Depth          | 12                                      |
| Min Samples Split  | 5                                       |
| Training Data      | 1,200 synthetic student profiles        |
| Train / Test Split | 80% / 20%                               |
| Output Classes     | 192 career roles across 12 domains      |
| Serialisation      | `joblib` → `career_model.pkl`           |

**Input Features (per student):**

| Feature                    | Source                           |
| -------------------------- | -------------------------------- |
| CGPA                       | Academic profile                 |
| Backlogs                   | Academic profile                 |
| Internships count          | Experience profile               |
| Projects count             | Experience profile               |
| Competitions (binary)      | Experience profile               |
| Leadership (binary)        | Experience profile               |
| Skills count               | Skills profile                   |
| Skill breadth (normalised) | Computed from skill categories   |
| Self-rated proficiency     | Skills profile                   |
| 5 personality scores       | Personality processor output     |
| 5 interest cluster signals | Interest cluster detector output |

**Why Random Forest over Deep Learning?**

- 1,200 samples is far too few for neural networks (need 10,000+)
- RF handles mixed numerical + categorical features without scaling
- Resistant to overfitting — individual trees overfit, ensemble does not
- Provides interpretable feature importance scores
- Trains in seconds, inference in microseconds — ideal for real-time web APIs
- No hyperparameter tuning needed for strong baseline performance

**Score Normalisation:** Raw probability outputs (e.g. 0.12) are converted to intuitive match percentages via min-max normalisation within the top-3 predictions. The top prediction serves as the 100% reference point, yielding final scores typically in the 55–85% range.

### 8.3 Career Readiness Index (CRI)

**File:** `backend/modules/cri_calculator.py`

The CRI is a **composite score out of 100** — the central metric combining academic, skill, experience, and market dimensions into one quantified career readiness number.

```
CRI = (Academic × 0.25) + (Skills × 0.30) + (Experience × 0.30) + (Market × 0.15)
```

| Sub-Index                | Weight | Formula                                                                          | Notes                                                                                                                           |
| ------------------------ | ------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Academic Reliability** | 25%    | `((CGPA/10) × 15) + consistency_bonus − backlog_penalty`                         | Consistency: High=+5, Medium=+3, Low=+0. Backlog penalty: −3 per backlog (max −10). Normalised to 0–25.                         |
| **Skill Depth**          | 30%    | `(skills_count × 2) + (proficiency × 1.5) + (languages × 1)`                     | Rewards both breadth (more skills) and depth (higher proficiency). Normalised to 0–30.                                          |
| **Experience Adequacy**  | 30%    | `(internships × 8) + (projects × 3) + comp_bonus + lead_bonus + volunteer_bonus` | Internships weighted highest (validated real-world exposure). Competitions +5, Leadership +4, Volunteer +2. Normalised to 0–30. |
| **Market Alignment**     | 15%    | `(matched_market_skills / total_demanded_skills) × 15`                           | Computed from live Adzuna listings for the student's target role. Measures current skill-market overlap.                        |

**Weight Rationale:** Skills + Experience carry 60% because employers prioritise demonstrated capability. Academic performance is significant (25%) but no longer the sole determinant. Market alignment (15%) rewards students whose skills are currently in demand.

**CRI Interpretation Bands:**

| Range  | Classification   |
| ------ | ---------------- |
| 75–100 | Highly Ready     |
| 50–74  | Moderately Ready |
| 30–49  | Developing       |
| 0–29   | Early Stage      |

**Projected CRI:** A secondary score simulating what the CRI would be if all identified skill gaps were closed — shown as a "potential ceiling" to motivate roadmap completion.

### 8.4 Market Engine — Adzuna API

**File:** `backend/modules/market_engine.py`

| Parameter         | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| API Provider      | Adzuna (`https://api.adzuna.com`)                                 |
| Endpoint          | `GET /v1/api/jobs/in/search/1`                                    |
| Country           | India (code: `in`)                                                |
| Results per query | Up to 20 listings per role                                        |
| Auth              | `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` as query params                |
| Role Hints        | 180+ role → domain mappings for correct skill context             |
| Mock Templates    | 20+ domain-specific mock descriptions for underrepresented fields |

**Skill Extraction:** Job descriptions are scanned using substring matching against a curated skill vocabulary. Each match increments a frequency counter → produces the "Top Skills Demanded" bar chart.

**Job Match Scoring:**

```
match% = (student_skills found in title + description) / total_student_skills × 100 + title_relevance_bonus (15%)
```

Top 5 jobs returned. Frontend displays contextual labels — "High match" (≥60%), "Good match" (≥30%), "Partial match" (>0%), "Relevant" (0%) — to avoid misleading display when API descriptions are sparse.

**Domain Relevance Gate:** Adzuna India is dominated by tech listings. For non-tech roles (e.g. "Nurse", "Lawyer"), the engine checks if ≥20% of extracted skills belong to the expected domain. If not, curated mock descriptions are substituted — ensuring market data is always meaningful.

**Parallel Market Trends:** The `/api/market-trends` endpoint runs all role queries in parallel (up to 6 workers) for the Market Intelligence page.

### 8.5 AI Text Generation — Groq / LLaMA 3

**File:** `backend/modules/ai_engine.py`

| Parameter   | Value                                          |
| ----------- | ---------------------------------------------- |
| Provider    | Groq Cloud (`https://groq.com`)                |
| Model       | `llama3-70b-8192` (LLaMA 3 70B)                |
| Temperature | 0.4 — deterministic and factual                |
| Max Tokens  | 400–600 per call (task-dependent)              |
| Fallback    | Rule-based template strings if API unreachable |

**Core Design Principle:** _"The intelligence is in the backend logic, not in the AI. Groq is a presentation layer only. This makes the system explainable, reproducible, and trustworthy — the AI cannot invent or alter any score."_

**5 Generation Tasks (4 run in parallel):**

| Task              | Output                                                                          | Tokens |
| ----------------- | ------------------------------------------------------------------------------- | ------ |
| Role Description  | 2-paragraph professional career description                                     | ~400   |
| Executive Summary | ~200-word personalised career intelligence overview                             | ~600   |
| 3-Phase Roadmap   | Three titled phases with 3 specific actions each, tied to actual missing skills | ~500   |
| Action Checklist  | 6 specific, time-bound, actionable tasks prioritised by impact                  | ~400   |
| Bridge Sentence   | Transitional insight connecting Track A and Track B findings                    | ~200   |

**Prompt Engineering:** Each prompt injects pre-computed numeric values (scores, percentages, skill lists, role names) into a structured system prompt. The model is instructed: _"Write professional, specific, actionable text. Use only the data provided. Do not invent any values or statistics."_ This prevents hallucination while producing fluent, readable output.

### 8.6 Resource Map Engine

**File:** `backend/modules/resource_map.py`

| Parameter            | Value                                                          |
| -------------------- | -------------------------------------------------------------- |
| Total Skills Mapped  | 241 unique keywords                                            |
| Matching Strategy    | Exact → Partial → Domain fallback                              |
| Platforms Covered    | YouTube, Udemy, Coursera, LinkedIn Learning, edX, Khan Academy |
| YouTube API          | YouTube Data API v3 (dynamic video search per skill)           |
| Resources per Action | 2–4 platform-specific links                                    |
| Parallel Workers     | Up to 8 concurrent YouTube API calls                           |

**How it works:**

1. Each roadmap action is parsed for skill keywords
2. The 241-keyword map is searched using a 3-tier strategy:
   - **Exact match:** Skill keyword found verbatim in the map
   - **Partial match:** Substring overlap between keyword and map entries
   - **Domain fallback:** Generic resources for the target domain
3. YouTube Data API v3 is called in parallel for each skill → returns dynamic, current video results
4. Resources are merged (curated first, YouTube supplements) and attached to each roadmap action

**Enrichment Flow:**

```
Missing Skills → Keyword Extraction → 241-Skill Map Lookup → YouTube API (parallel)
    → Merge Curated + Dynamic → Attach to Roadmap Actions → Return Enriched Roadmap
```

---

## 🔀 Dual-Track Career Analysis

AlignIQ analyses **two career paths simultaneously** — this is the core differentiator:

|             | Track A — Best Fit                                                                 | Track B — Chosen Career                                                                |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Source**  | ML model prediction (data-driven)                                                  | Student's stated goal (aspiration-driven)                                              |
| **Method**  | Random Forest top-1 prediction based on full profile                               | Alignment scoring against target role requirements                                     |
| **Output**  | Role, match %, why suited, strengths, skills to develop, salary, growth trajectory | Role, alignment score, 3 sub-matches, skill gap analysis, market data, 3-phase roadmap |
| **Purpose** | Shows what the data says is the optimal fit                                        | Validates (or challenges) the student's own choice                                     |

**Alignment Score Formula (Track B):**

```
Alignment = (Interest Match × 0.40) + (Skill Match × 0.35) + (Experience Match × 0.25)
```

| Component        | Weight | What It Measures                                                   |
| ---------------- | ------ | ------------------------------------------------------------------ |
| Interest Match   | 40%    | Overlap between activity clusters and target role's domain signals |
| Skill Match      | 35%    | Percentage of role-required skills the student already has         |
| Experience Match | 25%    | Experience adequacy relative to typical entry-level requirements   |

**Why dual-track?** Students often choose careers based on social pressure. Showing both what the data recommends and what the student wants creates a productive, evidence-based conversation — validating good choices or surfacing misalignment without being dismissive.

---

## 🎭 3-Act Intelligence Report

The results are presented as a **cinematic 3-act narrative** with premium glass-morphism UI:

### Act I — Profile Snapshot

- **Glass summary card** with student identity and generated profile ID
- **Bidirectional personality spectrum bars** (5 dimensions, each showing position between two poles)
- **Interest cluster signals** with strength indicators (strong / moderate / emerging)
- **AI-generated bridge sentence** connecting personality to career trajectory

### Act II — Career Analysis

- **Animated CRI ring** (SVG donut) with score, classification band, and projected CRI
- **4 sub-index progress bars** with individual dimension scores
- **Track A card** — ML best-fit career with gradient styling, match %, strengths, skills to develop
- **Track B card** — Chosen career with 3 alignment dimension bars, skill gap severity, market demand chart
- **2nd and 3rd best-fit cards** with match scores

### Act III — Action Path

- **3-Phase personalised roadmap** with gradient timeline, duration estimates, and enriched resource links per action
- **Interactive action checklist** with live progress bar and completion state
- **Top 5 live job cards** with company, location, salary, contextual match labels, and direct Apply links
- **AI-generated executive summary** as closing prose

**UI Design Language:**

- Glass-morphism panels (`backdrop-blur`, translucent borders, subtle gradients)
- Framer Motion entrance animations (staggered reveals, spring physics)
- Responsive layout with xs breakpoint (475px) for mobile devices
- Dark theme with zinc/slate colour palette and blue/violet/emerald accents

---

## ⚡ Performance Architecture — Parallelisation

The backend uses Python's `concurrent.futures.ThreadPoolExecutor` to parallelise independent operations:

### `/api/analyze` — 2-Phase Parallel Architecture

```python
# Phase A: 4 independent operations (parallel)
ThreadPoolExecutor(max_workers=4):
  ├── predict_best_fit_careers(processed)     # ML inference (~100ms)
  ├── fetch_jobs(target_role, "India")        # Adzuna API (~2-3s)
  ├── calculate_cri(processed)                # CRI formula (~10ms)
  └── generate_role_description(role, domain) # Groq LLM (~2-3s)

# Phase B: 4 LLM calls (parallel)
ThreadPoolExecutor(max_workers=4):
  ├── generate_roadmap(role, missing_skills, ...)    # Groq (~3-4s)
  ├── generate_bridge_sentence(name, roles, ...)     # Groq (~2-3s)
  ├── generate_executive_summary(name, data, ...)    # Groq (~3-4s)
  └── generate_action_checklist(role, skills, ...)   # Groq (~2-3s)

# Phase C: Resource enrichment (parallel YouTube)
ThreadPoolExecutor(max_workers=9):
  └── YouTube API calls for each roadmap skill       # (~1-2s total)
```

### `/api/market-trends` — Parallel Role Fetching

```python
ThreadPoolExecutor(max_workers=6):
  └── fetch_jobs(role, "India") for each role  # All roles simultaneously
```

### `/api/skill-resources` — Parallel YouTube Enrichment

```python
ThreadPoolExecutor(max_workers=8):
  └── YouTube API search for each skill  # All skills simultaneously
```

**Performance Results:**

| Endpoint                          | Before (Sequential) | After (Parallel) | Improvement   |
| --------------------------------- | ------------------- | ---------------- | ------------- |
| `/api/analyze`                    | ~30s                | ~8–12s           | **3× faster** |
| `/api/market-trends` (3 roles)    | ~15s                | ~5s              | **3× faster** |
| `/api/skill-resources` (8 skills) | ~10s                | ~2s              | **5× faster** |

---

## 🖥️ Frontend Architecture

### Framework

| Technology    | Version                    | Purpose                                                          |
| ------------- | -------------------------- | ---------------------------------------------------------------- |
| Next.js       | 16 (App Router, Turbopack) | Framework, routing, SSR/CSR hybrid                               |
| React         | 19                         | Component library                                                |
| TypeScript    | 5                          | Full type safety across all components and API responses         |
| TailwindCSS   | v4                         | Utility-first styling with custom design tokens                  |
| Framer Motion | 11                         | Page transitions, step animations, loading sequences, SVG gauges |
| Recharts      | —                          | Horizontal bar charts for skill demand data                      |
| shadcn/ui     | —                          | Base UI component primitives (inputs, labels, buttons, cards)    |

### Pages

| Route          | Component                  | Description                                                  |
| -------------- | -------------------------- | ------------------------------------------------------------ |
| `/`            | `app/page.tsx`             | Main SPA — Hero → 4-Step Assessment → Loading → 3-Act Report |
| `/market`      | `app/market/page.tsx`      | Market Intelligence — live skill demand by domain & role     |
| `/methodology` | `app/methodology/page.tsx` | Complete technical documentation (18 sections)               |

### View State Machine

The homepage manages all stages as **React state, not URL routes** — preventing navigation issues and keeping session data in memory:

```
hero → input (step 1–4) → loading → results
        ↑                              │
        └── "New Assessment" ──────────┘
```

### Input Module Components

| #   | Component                      | Step                                                                                            |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | `academic-module.tsx`          | Academic Profile — name, field, CGPA, consistency, backlogs                                     |
| 2   | `experience-skills-module.tsx` | Experience & Skills — skills, proficiency, languages, internships, projects, toggles, readiness |
| 3   | `career-goal-module.tsx`       | Career Goal — domain, role, activities                                                          |
| 4   | `personality-module.tsx`       | Personality — 8 forced-choice A/B questions                                                     |

### Result Components (3-Act Structure)

| Component              | Act | What It Renders                                                                     |
| ---------------------- | --- | ----------------------------------------------------------------------------------- |
| `act-one-profile.tsx`  | I   | Glass summary card, bidirectional personality spectrum bars, interest clusters      |
| `act-two-analysis.tsx` | II  | CRI ring + sub-indices, dual-track career cards (best-fit + chosen), alignment bars |
| `act-three-path.tsx`   | III | Gradient roadmap timeline with resources, interactive checklist, live job cards     |

---

## 🔌 API Reference

### `POST /api/analyze`

Runs the full analysis pipeline. Returns a complete intelligence report.

**Request Body (4-step structure):**

```json
{
  "academic": {
    "name": "Mohan Raj",
    "field_of_study": "Computer Science",
    "cgpa": 8.2,
    "consistency": "high",
    "backlogs": 0
  },
  "experience_skills": {
    "selected_skills": ["Python", "React", "SQL", "Machine Learning"],
    "proficiency_rating": 7,
    "languages_known": ["Python", "JavaScript"],
    "internships": 2,
    "projects": 3,
    "leadership": true,
    "competitions": true,
    "volunteer": false,
    "earned_from_skill": true,
    "readiness_rating": 7
  },
  "career_goal": {
    "target_domain": "Technology & Engineering",
    "target_role": "Full Stack Developer",
    "activities": ["coding", "designing", "problem solving"]
  },
  "personality": {
    "answers": {
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
}
```

**Response Structure:**

```json
{
  "identity": {
    "name": "Mohan Raj",
    "profile_id": "AQ-3F8A2C1D",
    "generated_date": "21 Feb 2026"
  },
  "interest_profile": {
    "personality": {
      "analytical_creative": 75,
      "independent_collaborative": 40,
      "theoretical_practical": 80,
      "stable_adaptive": 55,
      "specialist_generalist": 65
    },
    "interest_clusters": [
      {
        "cluster": "Technical & Analytical",
        "signal": "strong",
        "activities": ["coding", "problem solving"]
      }
    ],
    "motivators": []
  },
  "best_fit": {
    "role": "Software Developer",
    "score": 82,
    "why": "Strong technical aptitude combined with practical orientation...",
    "strengths": ["Python", "React"],
    "skills_to_develop": ["Docker", "System Design"],
    "salary_range": "6–14 LPA",
    "growth_trajectory": "High — strong demand across all sectors",
    "market_demand": "Very High",
    "second_fit": { "role": "Data Analyst", "score": 71 },
    "third_fit": { "role": "Product Manager", "score": 64 }
  },
  "chosen_career": {
    "role": "Full Stack Developer",
    "interest_match": 72,
    "skill_match": 65,
    "experience_match": 70,
    "alignment_score": 69,
    "role_description": "A Full Stack Developer designs and builds...",
    "market_data": {
      "top_skills": [
        ["React", 42],
        ["Node.js", 38],
        ["Python", 35]
      ],
      "avg_experience": "0–2 years (entry level)",
      "entry_salary": "6–14 LPA"
    },
    "you_have": ["Python", "React", "SQL"],
    "missing_skills": ["Docker", "System Design", "TypeScript"],
    "gap_severity": "Moderate",
    "gap_timeline": "4–8 months",
    "roadmap": {
      "phase_1": {
        "title": "Build Core Foundation",
        "duration": "0–2 months",
        "actions": [
          {
            "action": "Complete a Docker fundamentals course",
            "resources": [
              {
                "title": "Docker for Beginners",
                "platform": "YouTube",
                "type": "course",
                "url": "https://..."
              }
            ]
          }
        ]
      },
      "phase_2": { "...": "..." },
      "phase_3": { "...": "..." }
    }
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
    {
      "title": "Full Stack Developer",
      "company": "Acme Corp",
      "location": "Bangalore",
      "apply_url": "https://...",
      "match_percentage": 65,
      "salary": "8–12 LPA"
    }
  ],
  "executive_summary": "Mohan demonstrates strong foundational alignment with technology roles...",
  "action_checklist": [
    "Complete a Docker fundamentals course within 2 weeks",
    "..."
  ],
  "bridge_sentence": "While the data suggests Software Developer as the optimal fit..."
}
```

---

### `GET /api/health`

Returns service status. Also used by the keep-alive daemon.

```json
{ "status": "ok", "version": "2.0", "timestamp": "2026-02-21T10:00:00Z" }
```

---

### `GET /api/market-trends`

Market Intelligence page endpoint. Accepts roles and optional domain context.

**Parameters:** `?roles=Role1&roles=Role2&domain=Technology%20%26%20Engineering`

```json
{
  "top_skills": [
    ["Python", 42],
    ["React", 38],
    ["SQL", 31]
  ],
  "domain_competitiveness": { "Technology & Engineering": 87 },
  "analyzed_roles": ["Software Developer", "Data Analyst"]
}
```

---

### `GET /api/skill-resources`

Returns curated + YouTube learning resources for a list of skills.

**Parameters:** `?skills=Docker&skills=TypeScript&skills=System%20Design` (max 10)

```json
{
  "Docker": [
    {
      "title": "Docker Crash Course",
      "platform": "YouTube",
      "type": "course",
      "url": "https://..."
    },
    {
      "title": "Docker Mastery",
      "platform": "Udemy",
      "type": "course",
      "url": "https://..."
    }
  ],
  "TypeScript": ["..."]
}
```

---

## 📊 Data Models & Type System

All TypeScript types are defined in `frontend/lib/types.ts`. The Flask backend mirrors these as Python dictionaries.

### Input Types (4-Step Form)

| Interface                 | Fields                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AcademicProfile`         | `name`, `field_of_study`, `cgpa` (number), `consistency` (`"low" \| "medium" \| "high"`), `backlogs` (number)                                                                        |
| `ExperienceSkillsProfile` | `selected_skills[]`, `proficiency_rating` (1–10), `languages_known[]`, `internships`, `projects`, `leadership`, `competitions`, `volunteer`, `earned_from_skill`, `readiness_rating` |
| `CareerGoalProfile`       | `target_domain`, `target_role`, `activities[]`                                                                                                                                       |
| `PersonalityProfile`      | `answers: Record<string, "A" \| "B">` — 8 entries                                                                                                                                    |
| `StudentProfile`          | `{ academic, experience_skills, career_goal, personality }`                                                                                                                          |

### Response Types

| Interface               | Key Fields                                                                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AnalysisResponse`      | `identity`, `interest_profile`, `best_fit`, `chosen_career`, `cri`, `jobs[]`, `executive_summary`, `action_checklist[]`, `bridge_sentence`                                                         |
| `BestFitCareer`         | `role`, `score` (%), `why`, `strengths[]`, `skills_to_develop[]`, `salary_range`, `growth_trajectory`, `market_demand`, `second_fit`, `third_fit`                                                  |
| `ChosenCareerAnalysis`  | `role`, `interest_match`, `skill_match`, `experience_match`, `alignment_score`, `role_description`, `market_data{}`, `you_have[]`, `missing_skills[]`, `gap_severity`, `gap_timeline`, `roadmap{}` |
| `CRIResult`             | `cri_total`, `academic_reliability_index`, `skill_depth_index`, `experience_adequacy_index`, `market_alignment_score`, `projected_cri`                                                             |
| `RoadmapPhase`          | `title`, `duration`, `actions[]` — each action may be a string or `EnrichedAction` with `resources[]`                                                                                              |
| `Resource`              | `title`, `platform`, `type` (`"course" \| "practice"`), `url`                                                                                                                                      |
| `JobResult`             | `title`, `company`, `location`, `apply_url`, `match_percentage`, `salary`                                                                                                                          |
| `InterestProfileResult` | `personality: PersonalityScores`, `interest_clusters[]`, `motivators[]`                                                                                                                            |

---

## 🛠️ Complete Technology Stack

### Frontend

| Technology    | Version                    | Purpose                                                                    |
| ------------- | -------------------------- | -------------------------------------------------------------------------- |
| Next.js       | 16 (App Router, Turbopack) | Framework, file-based routing, SSR/CSR hybrid                              |
| React         | 19                         | Component library with hooks                                               |
| TypeScript    | 5                          | Type safety across all components and API contracts                        |
| TailwindCSS   | v4                         | Utility-first CSS with custom design tokens in `globals.css`               |
| Framer Motion | 11                         | Page transitions, step animations, loading sequences, SVG gauge animations |
| Recharts      | —                          | Horizontal bar charts for skill demand visualisation                       |
| shadcn/ui     | —                          | Base UI component primitives (inputs, buttons, cards, dialogs)             |

### Backend

| Technology         | Version | Purpose                                                |
| ------------------ | ------- | ------------------------------------------------------ |
| Python             | 3.11+   | Core runtime                                           |
| Flask              | 3.x     | REST API framework                                     |
| Gunicorn           | —       | Production WSGI server (Render deployment)             |
| Flask-CORS         | —       | Cross-origin request handling                          |
| scikit-learn       | —       | Random Forest career prediction model                  |
| pandas + numpy     | —       | Data processing and ML feature engineering             |
| joblib             | —       | Model serialisation / deserialisation                  |
| Groq SDK           | —       | LLaMA 3 70B text generation (AI presentation layer)    |
| Adzuna API         | v1      | Live job market data — India endpoint                  |
| YouTube Data API   | v3      | Dynamic video learning resources for skill gaps        |
| python-dotenv      | —       | Environment variable management                        |
| concurrent.futures | stdlib  | ThreadPoolExecutor for parallelised pipeline execution |

### Infrastructure

| Service | Purpose                                                  |
| ------- | -------------------------------------------------------- |
| Vercel  | Frontend hosting (automatic from GitHub, zero-config)    |
| Render  | Backend hosting (web service, free tier with keep-alive) |
| GitHub  | Source control and CI/CD trigger                         |

---

## 🗂️ Project Structure

```
AlignIQ/
├── README.md
│
├── backend/
│   ├── app.py                    # Flask app — 4 API routes + keep-alive daemon
│   │                             # 2-phase ThreadPoolExecutor parallelisation
│   ├── requirements.txt          # Flask, gunicorn, scikit-learn, groq, etc.
│   ├── render.yaml               # Render.com deployment blueprint
│   ├── .env.example              # All required environment variables
│   │
│   ├── data/
│   │   └── career_dataset.csv    # 1,200-sample ML training data (12 domains)
│   │
│   ├── model/
│   │   ├── __init__.py           # Model loader — joblib deserialisation at startup
│   │   └── train_model.py        # Offline training script (RF, 100 trees)
│   │
│   └── modules/
│       ├── profile_processor.py  # Input normalisation + vectorisation + scoring
│       ├── cri_calculator.py     # 4-dimension CRI formula engine
│       ├── ai_engine.py          # Groq API wrapper — 5 generation tasks
│       ├── market_engine.py      # Adzuna API + 180 role hints + parallel fetching
│       └── resource_map.py       # 241-skill map + YouTube API + parallel enrichment
│
└── frontend/
    ├── .env.example              # NEXT_PUBLIC_API_URL template
    ├── next.config.mjs           # Next.js 16 configuration
    ├── package.json              # Dependencies and scripts
    ├── tsconfig.json             # TypeScript configuration
    ├── postcss.config.mjs        # PostCSS for TailwindCSS v4
    ├── components.json           # shadcn/ui configuration
    │
    ├── app/
    │   ├── layout.tsx            # Root layout — fonts, theme provider, metadata
    │   ├── globals.css           # TailwindCSS v4 imports + custom design tokens
    │   ├── page.tsx              # Main SPA — hero/input/loading/results state machine
    │   ├── market/
    │   │   └── page.tsx          # Market Intelligence — domain & role analysis
    │   └── methodology/
    │       └── page.tsx          # Technical documentation — 18 sections
    │
    ├── components/
    │   ├── theme-provider.tsx    # Dark mode theme wrapper
    │   ├── layout/
    │   │   ├── navbar.tsx        # Navigation bar (Home, Market, Methodology)
    │   │   └── footer.tsx        # Minimal footer
    │   ├── input-modules/        # 4 assessment step components
    │   │   ├── academic-module.tsx          # Step 1 — Academic profile
    │   │   ├── experience-skills-module.tsx # Step 2 — Experience + Skills
    │   │   ├── career-goal-module.tsx       # Step 3 — Career goal
    │   │   └── personality-module.tsx       # Step 4 — Personality questions
    │   ├── results/              # 3-act report components
    │   │   ├── act-one-profile.tsx    # Act I — Profile snapshot
    │   │   ├── act-two-analysis.tsx   # Act II — CRI + dual-track cards
    │   │   └── act-three-path.tsx     # Act III — Roadmap + checklist + jobs
    │   └── ui/                   # shadcn/ui primitives (~50 components)
    │
    ├── lib/
    │   ├── types.ts              # All TypeScript type definitions (4-step input + response)
    │   ├── constants.ts          # 12 domains × 192 roles mapping data
    │   └── utils.ts              # Utility functions (cn, etc.)
    │
    ├── hooks/
    │   ├── use-mobile.ts         # Mobile detection hook
    │   └── use-toast.ts          # Toast notification hook
    │
    └── styles/
        └── globals.css           # Additional global styles
```

---

## 🚀 Getting Started — Local Development

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Groq API key** — [console.groq.com](https://console.groq.com)
- **Adzuna API key** — [developer.adzuna.com](https://developer.adzuna.com)
- **YouTube Data API v3 key** — [console.cloud.google.com](https://console.cloud.google.com) _(optional but recommended for resource enrichment)_

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
# Edit .env and fill in your API keys (see Environment Variables below)

# 5. Train the ML model (first time only)
python model/train_model.py

# 6. Start the Flask server
python app.py
```

The backend will be running at **http://localhost:5000**

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Or: echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# 4. Start the dev server
npm run dev
```

The frontend will be running at **http://localhost:3000**

### Environment Variables

**`backend/.env`**

```env
GROQ_API_KEY=your_groq_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
YOUTUBE_API_KEY=your_youtube_data_api_v3_key    # optional — enables dynamic video resources
FLASK_ENV=development

# Set automatically by Render on deployment:
# RENDER_EXTERNAL_URL=https://aligniq-backend.onrender.com
# FRONTEND_URL=https://align-iq-eight.vercel.app
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# Production: NEXT_PUBLIC_API_URL=https://aligniq-backend.onrender.com
```

### Training the ML Model

The model is pre-trained and included, but you can retrain at any time:

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

## ☁️ Deployment Guide

### Frontend → Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** → `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` → your Render backend URL
5. Deploy — Vercel handles build automatically

### Backend → Render

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

| Key               | Value                               |
| ----------------- | ----------------------------------- |
| `GROQ_API_KEY`    | your Groq key                       |
| `ADZUNA_APP_ID`   | your Adzuna app ID                  |
| `ADZUNA_APP_KEY`  | your Adzuna app key                 |
| `YOUTUBE_API_KEY` | your YouTube Data API v3 key        |
| `FLASK_ENV`       | `production`                        |
| `FRONTEND_URL`    | `https://align-iq-eight.vercel.app` |

6. Deploy → Backend URL: `https://aligniq-backend.onrender.com`
7. Verify: `GET https://aligniq-backend.onrender.com/api/health`

> **Keep-Alive:** The backend runs a daemon thread that pings `/api/health` every 14 minutes, preventing Render free-tier spin-down without any external cron service.

---

## 🧩 Key Design Decisions

### 1. Single-page state machine, not multi-page routes

All 4 assessment steps share state. A client-side state machine (`hero → input → loading → results`) keeps data in memory, prevents back-button issues mid-assessment, and enables instant animated transitions between steps.

### 2. AI is a presentation layer, not the analysis engine

If the LLM computed scores, results would be non-reproducible and potentially hallucinated. The Python backend computes **all** numeric scores deterministically. The LLM only formats pre-computed data into readable prose — making the system auditable, debuggable, and trustworthy for high-stakes career decisions.

### 3. Random Forest over deep learning

1,200 training samples is far too few for deep learning (needs 10,000+). Random Forest performs excellently on small tabular datasets, is inherently interpretable via feature importances, trains in seconds, runs inference in microseconds, and requires no hyperparameter tuning for strong baselines.

### 4. 4-step form consolidation (from 6)

The original 6-step assessment had high abandonment rates. Merging Identity + Academic → Step 1, Experience + Skills → Step 2, and Intent + Interests → Step 3 reduced friction by 33% while preserving all analytical signal. Personality remains Step 4 (cannot be merged without compromising the forced-choice UX).

### 5. Dual-track career analysis

Students often choose careers based on social pressure. Showing both the data-recommended path (Track A) and the student's stated goal (Track B) creates a productive, evidence-based conversation — validating good choices or surfacing misalignment without dismissing aspirations.

### 6. Domain-aware market engine

Adzuna India is dominated by tech listings. A search for "Nurse" or "Lawyer" returns mostly software engineering jobs. The engine uses 180+ role → domain hints and a 20% relevance gate to detect off-domain results, substituting curated mock descriptions — ensuring market data is always meaningful.

### 7. 241-skill resource map over static links

A smart matching engine (exact → partial → domain fallback) enriches every roadmap action with real platform links. YouTube API v3 makes video resources dynamic and always current. Static links go stale; this approach ensures resources stay relevant.

### 8. 2-phase parallelised backend

Sequential execution of 5 LLM calls + API fetches + YouTube enrichment took ~30 seconds. Grouping independent operations into ThreadPoolExecutor phases reduced total time to ~8–12 seconds — a 3× improvement with zero additional dependencies (uses stdlib `concurrent.futures`).

### 9. Premium glass-morphism report UI

Career reports should feel important. Glass panels, gradient cards, animated CRI rings, and spring-physics entrance animations create a premium experience that makes students _want_ to read and share their report — increasing engagement with actionable recommendations.

### 10. Self-healing keep-alive on Render

A daemon thread pings the backend's own `/api/health` every 14 minutes. Render's free tier spins down after 15 minutes of inactivity — this prevents that without any external cron service or paid tier upgrade.

---

## 🔮 Limitations & Future Work

### Current Limitations

| Limitation                                          | Impact                                                                 | Mitigation                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ML model trained on synthetic data                  | Prediction accuracy bounded by training data quality                   | Architecture is retrain-ready — swap `career_dataset.csv` and re-run `train_model.py` |
| Adzuna India limited for non-tech roles             | Mock fallback activates frequently for law, healthcare, arts, trades   | 20+ curated mock templates ensure domain-appropriate data                             |
| Single-session only                                 | No user accounts, history, or progress tracking                        | Report data exists in memory — PDF export planned                                     |
| Roadmap not connected to verified learning catalogs | Resources are curated + YouTube-sourced, not from official course APIs | Resource map covers 241 skills across 6 platforms                                     |
| YouTube API quota limits                            | High traffic may exhaust daily quota (10,000 units)                    | Graceful fallback to curated-only resources when API unavailable                      |

### Planned Improvements

- [ ] User authentication + saved report history with version tracking
- [ ] LinkedIn OAuth to auto-populate skills and experience from profile
- [ ] Real student dataset collection → retrain model with ground-truth data
- [ ] PDF export of the complete 3-act intelligence report
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Course API integrations (Coursera, Udemy official APIs) for verified recommendations
- [ ] A/B testing framework for UX optimisation of assessment flow
- [ ] WebSocket-based streaming for real-time report generation progress

---

## 📊 Quick Reference — Numbers That Matter

| Metric                 | Value                                                                  |
| ---------------------- | ---------------------------------------------------------------------- |
| Input steps            | **4**                                                                  |
| Career domains         | **12**                                                                 |
| Career roles           | **192**                                                                |
| Report acts            | **3**                                                                  |
| Skills mapped          | **241**                                                                |
| API endpoints          | **4**                                                                  |
| API integrations       | **4** (Groq, Adzuna, YouTube, scikit-learn)                            |
| ML training samples    | **1,200**                                                              |
| ML estimators          | **100** Random Forest trees                                            |
| CRI sub-dimensions     | **4**                                                                  |
| Personality dimensions | **5**                                                                  |
| Roadmap phases         | **3**                                                                  |
| LLM generation tasks   | **5**                                                                  |
| Live jobs returned     | **5**                                                                  |
| Analysis time          | **~8–12s**                                                             |
| Learning platforms     | **6** (YouTube, Udemy, Coursera, LinkedIn Learning, edX, Khan Academy) |

---

## 📝 License

This project is for academic and educational purposes.

---

<div align="center">

Built with 🔥 by the AlignIQ team

_Adaptive career intelligence for every student, every field._

</div>
