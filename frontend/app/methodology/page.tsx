"use client";

import { Navbar } from "@/components/layout/navbar";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
          {/* Page Header */}
          <div className="mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[11px] text-zinc-500 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Complete Technical Documentation
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
              How ALIGNIQ Works
            </h1>
            <p className="text-zinc-500 text-base max-w-2xl leading-relaxed">
              End-to-end technical reference — architecture, algorithms, data
              flows, modules, scoring logic, APIs, and design decisions.
              Everything you need for a viva, report, or presentation.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-14 rounded-2xl border border-white/[0.05] bg-zinc-950/60 p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Table of Contents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {TOC_ITEMS.map((item, i) => (
                <a
                  key={i}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  <span className="text-[10px] font-mono text-zinc-700 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-20">
            {/* 1 */}
            <Section id="overview" num="01" title="Project Overview">
              <p className="mb-4">
                <strong className="text-white">AlignIQ</strong> (Adaptive Career
                Alignment Intelligence) is a full-stack web application
                providing personalised, data-driven career guidance for students
                across all academic disciplines. It combines machine learning,
                real-time market data, and AI-generated insights to produce a
                structured intelligence report unique to each student.
              </p>
              <InfoGrid
                items={[
                  {
                    label: "Full Name",
                    value: "AlignIQ — Adaptive Career Alignment Intelligence",
                  },
                  { label: "Type", value: "Full-Stack Web Application" },
                  {
                    label: "Target Users",
                    value: "Students (UG/PG), final-year, any discipline",
                  },
                  {
                    label: "Domains Covered",
                    value:
                      "12 domains — Tech, Business, Design, Healthcare, Law, Finance, Media, Science, Arts, Sports, Education, Trades",
                  },
                  {
                    label: "Total Roles",
                    value: "192 career roles across all 12 domains",
                  },
                  {
                    label: "Assessment Modules",
                    value:
                      "4 input steps — Academic, Experience & Skills, Career Goal, Personality",
                  },
                  {
                    label: "Report Structure",
                    value:
                      "3-act intelligence report — Profile, Analysis, Action Path",
                  },
                  {
                    label: "Backend",
                    value: "Python · Flask REST API · Gunicorn · port 5000",
                  },
                  {
                    label: "Frontend",
                    value:
                      "Next.js 16 · TypeScript · TailwindCSS v4 · Glass-morphism UI",
                  },
                  { label: "AI Provider", value: "Groq Cloud (LLaMA 3 70B)" },
                  {
                    label: "Market Data",
                    value: "Adzuna Jobs API — India endpoint",
                  },
                  {
                    label: "ML Model",
                    value: "Random Forest Classifier (scikit-learn)",
                  },
                ]}
              />
            </Section>

            {/* 2 */}
            <Section id="problem" num="02" title="Problem Statement">
              <p className="mb-4">
                Students face a critical gap between academic training, personal
                interests, and actual job market demand. Existing career
                guidance tools are either too generic (personality-type surveys)
                or too narrow (tech-only platforms). This creates:
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "Careers chosen based on social pressure, not data",
                  "No visibility into real-time market skill demand",
                  "No personalised, field-agnostic skill gap analysis",
                  "Career readiness is never quantified — only guessed",
                  "No actionable step-by-step roadmap tied to personal gaps",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-white">AlignIQ solves this</strong> by
                running a 4-step data collection pipeline, computing a
                quantified Career Readiness Index, performing dual-track career
                matching, pulling live job listings, and generating a fully
                personalised roadmap with curated learning resources — all in a
                single 3-act intelligence report.
              </p>
            </Section>

            {/* 3 */}
            <Section id="architecture" num="03" title="System Architecture">
              <p className="mb-6">
                AlignIQ follows a{" "}
                <strong className="text-white">
                  7-stage parallelised pipeline architecture
                </strong>
                . Each stage produces structured data consumed by the next.
                Independent stages execute in parallel via ThreadPoolExecutor.
              </p>
              <div className="relative space-y-3">
                {ARCHITECTURE_STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 flex items-center justify-center text-[11px] font-bold text-blue-400 shrink-0">
                        {i + 1}
                      </div>
                      {i < ARCHITECTURE_STEPS.length - 1 && (
                        <div className="w-px h-4 bg-white/[0.06] mt-1" />
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-white/[0.05] bg-zinc-950/40 px-4 sm:px-5 py-3.5 mb-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                        <span className="text-sm font-semibold text-white">
                          {step.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600 shrink-0">
                          {step.tech}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                  Data Flow Summary
                </p>
                <p className="text-sm text-zinc-400 font-mono leading-7">
                  User fills 4 steps →{" "}
                  <span className="text-blue-400">POST /api/analyze</span> →
                  Profile Processor normalises → Phase A parallel (ML + Jobs +
                  CRI + Role Desc) → Phase B parallel (4 LLM calls) → Resource
                  Enrichment (YouTube API) → JSON → React renders 3-act report
                </p>
              </div>
            </Section>

            {/* 4 */}
            <Section
              id="frontend"
              num="04"
              title="Frontend — Next.js Application"
            >
              <p className="mb-5">
                The frontend is built with{" "}
                <strong className="text-white">
                  Next.js 16 (App Router, Turbopack)
                </strong>
                , TypeScript, and TailwindCSS v4. It is a single-page
                application with 4 view states managed client-side, featuring
                premium glass-morphism UI and full mobile responsiveness.
              </p>

              <SubHeading>Pages</SubHeading>
              <InfoGrid
                items={[
                  {
                    label: "/ (Home)",
                    value:
                      "Main SPA — Hero → 4-step Input wizard → Loading → 3-Act Results (4 view states)",
                  },
                  {
                    label: "/methodology",
                    value: "This page — full technical documentation",
                  },
                  {
                    label: "/market",
                    value:
                      "Market Intelligence — live job demand analysis by domain & role",
                  },
                ]}
              />

              <SubHeading>View State Machine</SubHeading>
              <p className="mb-3 text-sm">
                The homepage manages all four stages as React state, not URL
                routes. This prevents navigation issues and keeps session data
                in memory across the whole assessment flow.
              </p>
              <div className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5 font-mono text-sm text-zinc-400">
                <span className="text-emerald-400">hero</span> →{" "}
                <span className="text-blue-400">input (step 1–4)</span> →{" "}
                <span className="text-violet-400">loading</span> →{" "}
                <span className="text-yellow-400">results</span>
                <br />
                <span className="text-zinc-600 text-xs">
                  (New Assessment button resets view to &apos;hero&apos; with
                  cleared state)
                </span>
              </div>

              <SubHeading>The 4 Input Steps</SubHeading>
              <div className="space-y-2">
                {INPUT_MODULES.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.04] bg-zinc-950/30 px-5 py-3.5 flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {m.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{m.desc}</p>
                      <p className="text-[11px] text-zinc-600 mt-1 font-mono">
                        Fields: {m.fields}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <SubHeading>Result Report Sections</SubHeading>
              <div className="space-y-2">
                {RESULT_COMPONENTS.map((c, i) => (
                  <InfoRow key={i} label={c.name} value={c.desc} />
                ))}
              </div>

              <SubHeading>Key Frontend Libraries</SubHeading>
              <InfoGrid
                items={[
                  {
                    label: "Next.js 16",
                    value:
                      "App Router, Turbopack, SSR/CSR hybrid, file-based routing, server components",
                  },
                  {
                    label: "TypeScript",
                    value:
                      "Full type safety across all components and API responses",
                  },
                  {
                    label: "TailwindCSS v4",
                    value:
                      "Utility-first CSS with custom design tokens in globals.css",
                  },
                  {
                    label: "Framer Motion",
                    value:
                      "Page transitions, step animations, loading sequences, gauge animations",
                  },
                  {
                    label: "Recharts",
                    value:
                      "Horizontal bar charts for skills demand in chosen career section",
                  },
                  {
                    label: "shadcn/ui",
                    value:
                      "Base UI primitives (inputs, labels, buttons, cards)",
                  },
                ]}
              />
            </Section>

            {/* 5 */}
            <Section id="backend" num="05" title="Backend — Flask REST API">
              <p className="mb-5">
                The backend is a{" "}
                <strong className="text-white">Python Flask REST API</strong>{" "}
                running on port 5000 (Gunicorn in production). It exposes 4
                endpoints and orchestrates all analysis modules using a 2-phase
                parallelised architecture via ThreadPoolExecutor (~8–12s total
                execution).
              </p>

              <SubHeading>API Endpoints</SubHeading>
              <div className="space-y-3 mb-6">
                <EndpointCard
                  method="POST"
                  path="/api/analyze"
                  desc="Main analysis endpoint. Accepts 4-step student profile JSON, runs parallelised backend pipeline (Phase A + Phase B + Resource Enrichment), returns the complete 3-act intelligence report."
                  input="StudentProfile (academic, experience_skills, career_goal, personality)"
                  output="AnalysisResponse (identity, interest_profile, best_fit, chosen_career, cri, jobs, executive_summary, action_checklist, bridge_sentence)"
                />
                <EndpointCard
                  method="GET"
                  path="/api/health"
                  desc="Health check — returns service status, version, and timestamp. Used by the frontend to verify the backend is running."
                  input="None"
                  output='{ status: "ok", version: "2.0", timestamp }'
                />
                <EndpointCard
                  method="GET"
                  path="/api/market-trends"
                  desc="Market Intelligence page endpoint. Accepts a list of roles and optional domain context, returns top demanded skills and domain competitiveness scores."
                  input="?roles=Role1&roles=Role2&domain=Domain (query string)"
                  output="{ top_skills, domain_competitiveness, analyzed_roles }"
                />
                <EndpointCard
                  method="GET"
                  path="/api/skill-resources"
                  desc="Returns curated + YouTube learning resources for a list of skills. Max 10 skills. Uses parallel YouTube API calls."
                  input="?skills=Skill1&skills=Skill2 (query string, max 10)"
                  output="{ [skill]: Resource[] } — per-skill resource arrays"
                />
              </div>

              <SubHeading>Backend Module Files</SubHeading>
              <div className="space-y-2">
                {BACKEND_MODULES.map((m, i) => (
                  <InfoRow key={i} label={m.file} value={m.desc} />
                ))}
              </div>

              <SubHeading>Environment Variables</SubHeading>
              <InfoGrid
                items={[
                  {
                    label: "GROQ_API_KEY",
                    value: "Groq Cloud API key for LLaMA 3 inference",
                  },
                  {
                    label: "ADZUNA_APP_ID",
                    value: "Adzuna API app identifier",
                  },
                  { label: "ADZUNA_APP_KEY", value: "Adzuna API secret key" },
                  {
                    label: "YOUTUBE_API_KEY",
                    value:
                      "YouTube Data API v3 key (optional — enables dynamic video resources)",
                  },
                  {
                    label: "NEXT_PUBLIC_API_URL",
                    value:
                      "Frontend → backend base URL (default: http://localhost:5000)",
                  },
                ]}
              />
            </Section>

            {/* 6 */}
            <Section
              id="profile-processor"
              num="06"
              title="Profile Processor Module"
            >
              <p className="mb-4">
                The profile processor (
                <code className="text-blue-400 font-mono text-xs">
                  profile_processor.py
                </code>
                ) is the first computation stage. It normalises raw form data
                into a structured, machine-readable format used by all
                downstream modules.
              </p>
              <div className="space-y-2 mb-6">
                {PROFILE_PROCESSOR_STEPS.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-zinc-600 shrink-0 mt-0.5">→</span>
                    <span className="text-zinc-400">{s}</span>
                  </div>
                ))}
              </div>

              <SubHeading>
                Personality Scoring — 8 Questions, 5 Dimensions
              </SubHeading>
              <p className="text-sm mb-3">
                The personality module presents 8 forced-choice A/B questions.
                Each answer maps to one pole of a bipolar dimension:
              </p>
              <InfoGrid
                items={[
                  {
                    label: "Analytical ↔ Creative",
                    value: "Logical vs imaginative thinking preference",
                  },
                  {
                    label: "Independent ↔ Collaborative",
                    value: "Solo work vs teamwork preference",
                  },
                  {
                    label: "Theoretical ↔ Practical",
                    value: "Conceptual vs applied learning style",
                  },
                  {
                    label: "Stable ↔ Adaptive",
                    value: "Routine vs dynamic environments",
                  },
                  {
                    label: "Specialist ↔ Generalist",
                    value: "Deep expertise vs broad knowledge",
                  },
                ]}
              />
              <p className="text-sm mt-4">
                Scores are normalised to 0–100 per dimension. These drive the
                Interest Profile visualisation and influence best-fit matching
                weights.
              </p>

              <SubHeading>Interest Cluster Detection</SubHeading>
              <p className="text-sm">
                Selected activities and work environments are mapped to 5
                clusters:{" "}
                <em className="text-zinc-300">
                  Technical & Analytical, Creative & Artistic, People &
                  Communication, Business & Operational, Science & Research
                </em>
                . Each cluster gets a signal strength:{" "}
                <span className="text-blue-400">strong</span>,{" "}
                <span className="text-violet-400">moderate</span>, or{" "}
                <span className="text-zinc-400">emerging</span> — shown on the
                Interest Profile card.
              </p>
            </Section>

            {/* 7 */}
            <Section id="cri" num="07" title="Career Readiness Index (CRI)">
              <p className="mb-4">
                The CRI is a{" "}
                <strong className="text-white">
                  quantified composite score out of 100
                </strong>{" "}
                representing a student&apos;s overall career preparedness. It is
                the central metric — the only score that combines academic,
                skills, experience, and market dimensions into one number.
              </p>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5 font-mono text-sm text-zinc-300 mb-6">
                <p className="text-blue-400 font-bold mb-2">CRI Formula</p>
                CRI = (Academic × 0.25) + (Skills × 0.30) + (Experience × 0.30)
                + (Market × 0.15)
              </div>

              <p className="text-sm mb-5 text-zinc-400">
                Weights reflect real hiring priorities. Skills + experience
                carry 60% because employers prioritise demonstrated capability.
                Academic performance is significant (25%) but no longer the sole
                determinant. Market alignment (15%) rewards students whose
                skills are currently demanded.
              </p>

              <div className="space-y-4">
                {CRI_FORMULAE.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">
                        {f.name}
                      </p>
                      <span className="text-xs font-mono text-zinc-500">
                        Weight: {f.weight}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-blue-300 mb-2">
                      {f.formula}
                    </p>
                    <p className="text-xs text-zinc-500">{f.notes}</p>
                  </div>
                ))}
              </div>

              <SubHeading>CRI Interpretation Bands</SubHeading>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    range: "75–100",
                    label: "Highly Ready",
                    color:
                      "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
                  },
                  {
                    range: "50–74",
                    label: "Moderate",
                    color: "text-blue-400 border-blue-500/30 bg-blue-500/5",
                  },
                  {
                    range: "30–49",
                    label: "Developing",
                    color:
                      "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
                  },
                  {
                    range: "0–29",
                    label: "Early Stage",
                    color: "text-red-400 border-red-500/30 bg-red-500/5",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border px-4 py-3 text-center ${b.color}`}
                  >
                    <p className="text-lg font-bold">{b.range}</p>
                    <p className="text-xs mt-0.5">{b.label}</p>
                  </div>
                ))}
              </div>

              <SubHeading>Projected CRI</SubHeading>
              <p className="text-sm text-zinc-400">
                A &quot;projected CRI&quot; is computed by simulating what the
                score would be if all missing skills were acquired. This is
                shown as a &quot;potential ceiling&quot; on the CRI card —
                motivating the student to follow the roadmap.
              </p>
            </Section>

            {/* 8 */}
            <Section id="ml" num="08" title="ML Model — Career Prediction">
              <p className="mb-5">
                AlignIQ uses a{" "}
                <strong className="text-white">Random Forest Classifier</strong>{" "}
                to predict the statistically optimal career for each student.
                The model is trained offline and loaded at server startup.
              </p>

              <SubHeading>Why Random Forest?</SubHeading>
              <ul className="space-y-2 mb-6">
                {[
                  "Handles both numerical and categorical-encoded features without scaling",
                  "Resistant to overfitting — individual trees overfit, the ensemble does not",
                  "Provides feature importance scores — explains WHY a career was predicted",
                  "Excellent on small-to-medium tabular datasets (our 1,200-sample case)",
                  "Trains in seconds, inference in microseconds — ideal for web APIs",
                  "No hyperparameter tuning needed for strong baseline performance",
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                    <span className="text-zinc-400">{p}</span>
                  </li>
                ))}
              </ul>

              <InfoGrid
                items={[
                  {
                    label: "Algorithm",
                    value: "RandomForestClassifier (scikit-learn)",
                  },
                  {
                    label: "Hyperparameters",
                    value: "100 estimators, max_depth=12, min_samples_split=5",
                  },
                  {
                    label: "Training Data",
                    value:
                      "1,200 synthetic student profiles across all domains",
                  },
                  {
                    label: "Train / Test Split",
                    value: "80% training · 20% testing",
                  },
                  {
                    label: "Input Features",
                    value:
                      "CGPA, backlogs, internships, projects, competitions, leadership, skills_count, skill_breadth, self_rating, 5 personality scores, 5 interest cluster signals",
                  },
                  {
                    label: "Output Classes",
                    value: "192 career roles across 12 domains",
                  },
                  {
                    label: "Prediction Output",
                    value:
                      "Top 3 careers with probability scores (normalised to match %)",
                  },
                  {
                    label: "Model File",
                    value:
                      "backend/model/career_model.pkl (joblib serialisation)",
                  },
                  {
                    label: "Training Script",
                    value: "backend/model/train_model.py",
                  },
                  {
                    label: "Dataset File",
                    value: "backend/data/career_dataset.csv",
                  },
                ]}
              />

              <SubHeading>Score Normalisation</SubHeading>
              <p className="text-sm text-zinc-400">
                Raw probability outputs (e.g. 0.12) are converted to intuitive
                percentages using min-max normalisation within the top-3
                predictions. The top prediction is always expressed as a
                relative 100% reference point, so final match% values are
                typically in the 55–85% range.
              </p>
            </Section>

            {/* 9 */}
            <Section
              id="dual-track"
              num="09"
              title="Dual-Track Career Analysis"
            >
              <p className="mb-5">
                AlignIQ analyses two career paths simultaneously. This is the
                core differentiator.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                    Track A — Best Fit
                  </p>
                  <p className="text-sm text-white font-semibold mb-2">
                    Statistically Optimal Career
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    The career with the highest ML model match score. Computed
                    purely from personality, education, skills, and interests —
                    without considering the student&apos;s stated goal. This is
                    what the data says suits them best.
                  </p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                    Track B — Chosen Career
                  </p>
                  <p className="text-sm text-white font-semibold mb-2">
                    Student&apos;s Stated Goal
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    The career the student wants (from the Intent module).
                    Analysed separately for alignment, skill gaps, market data,
                    and a 3-phase roadmap. Represents aspiration vs statistical
                    fit.
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-5">
                When Track A and Track B are the same role, the student has
                strong alignment between passion and statistical fit — a
                positive signal highlighted in the report.
              </p>

              <SubHeading>Alignment Score Formula</SubHeading>
              <div className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5 font-mono text-sm text-zinc-400 mb-4">
                Alignment = (Interest Match × 0.40) + (Skill Match × 0.35) +
                (Experience Match × 0.25)
              </div>
              <InfoGrid
                items={[
                  {
                    label: "Interest Match (40%)",
                    value:
                      "Overlap between student's activity clusters and the target role's domain signals",
                  },
                  {
                    label: "Skill Match (35%)",
                    value:
                      "Percentage of role-required skills that the student already has",
                  },
                  {
                    label: "Experience Match (25%)",
                    value:
                      "Experience adequacy score relative to typical entry-level requirements",
                  },
                ]}
              />
            </Section>

            {/* 10 */}
            <Section id="market" num="10" title="Market Engine — Adzuna API">
              <p className="mb-5">
                Real-time job market data is fetched from the{" "}
                <strong className="text-white">Adzuna Jobs API</strong> (India
                endpoint). This powers both the live job listings in the report
                and the Market Intelligence page.
              </p>
              <InfoGrid
                items={[
                  {
                    label: "API Provider",
                    value: "Adzuna (https://api.adzuna.com)",
                  },
                  { label: "Endpoint", value: "GET /v1/api/jobs/in/search/1" },
                  { label: "Country", value: "India (country code: in)" },
                  {
                    label: "Results per call",
                    value: "Up to 20 job listings per role query",
                  },
                  {
                    label: "Auth",
                    value: "ADZUNA_APP_ID + ADZUNA_APP_KEY as query parameters",
                  },
                  {
                    label: "Fallback",
                    value:
                      "Domain-specific mock data when API returns off-domain results",
                  },
                ]}
              />

              <SubHeading>Skill Extraction from Listings</SubHeading>
              <p className="text-sm mb-3 text-zinc-400">
                Job descriptions are scanned using substring matching against a
                curated list of 100+ skills. Each skill match increments a
                frequency counter. Top skills become the &quot;Market
                Demand&quot; bar chart in the Chosen Career section.
              </p>

              <SubHeading>Job Match Scoring Logic</SubHeading>
              <div className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5 font-mono text-sm text-zinc-400 mb-4">
                match% = (student_skills found in job title+description) /
                total_student_skills × 100 + title_relevance_bonus (15%)
              </div>
              <p className="text-sm text-zinc-500">
                Jobs are ranked by match % and the top 5 are returned. The
                frontend shows contextual labels — &quot;High match&quot;
                (≥60%), &quot;Good match&quot; (≥30%), &quot;Partial match&quot;
                (&gt;0%), &quot;Relevant&quot; (0%) — instead of raw percentages
                to avoid misleading display when API descriptions are sparse.
              </p>

              <SubHeading>Domain Relevance Gating</SubHeading>
              <p className="text-sm text-zinc-400">
                For non-tech roles, Adzuna India returns software jobs
                regardless of query (due to listing density). A relevance gate
                checks if ≥20% of extracted skills belong to the expected
                domain. If not, the system substitutes curated mock descriptions
                — ensuring market data is always meaningful and
                domain-appropriate.
              </p>
            </Section>

            {/* 11 */}
            <Section id="ai" num="11" title="AI Engine — Groq / LLaMA 3">
              <p className="mb-4">
                The AI engine is a{" "}
                <strong className="text-white">text generation layer</strong>,
                not an analysis layer. All scores and insights are computed
                deterministically by the backend. Groq receives pre-computed
                results and formats them into professional, readable prose.
              </p>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-5 mb-5">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">
                  Core Design Principle
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  &quot;The intelligence is in the backend logic, not in the AI.
                  Groq is a presentation layer only. This makes the system
                  explainable, reproducible, and trustworthy — the AI cannot
                  invent or alter any score.&quot;
                </p>
              </div>

              <InfoGrid
                items={[
                  { label: "Provider", value: "Groq Cloud (https://groq.com)" },
                  { label: "Model", value: "llama3-70b-8192 (LLaMA 3 70B)" },
                  {
                    label: "Temperature",
                    value: "0.4 — deterministic and factual; not creative",
                  },
                  {
                    label: "Max tokens",
                    value: "400–600 per call depending on task",
                  },
                  {
                    label: "Fallback",
                    value:
                      "Rule-based template strings if Groq API is unreachable",
                  },
                ]}
              />

              <SubHeading>AI-Generated Outputs</SubHeading>
              <div className="space-y-2">
                {AI_OUTPUTS.map((o, i) => (
                  <InfoRow key={i} label={o.name} value={o.desc} />
                ))}
              </div>

              <SubHeading>Prompt Engineering Strategy</SubHeading>
              <p className="text-sm text-zinc-400">
                Each prompt injects pre-computed numeric values (scores,
                percentages, skill lists, role names) into a structured system
                prompt. The model is instructed:{" "}
                <em className="text-zinc-300">
                  &quot;Write professional, specific, actionable text. Use only
                  the data provided. Do not invent any values or
                  statistics.&quot;
                </em>{" "}
                This prevents hallucination while producing fluent, readable
                output.
              </p>
            </Section>

            {/* 12 */}
            <Section id="market-page" num="12" title="Market Intelligence Page">
              <p className="mb-5">
                A standalone research tool at{" "}
                <code className="text-blue-400 font-mono text-xs">/market</code>{" "}
                that lets anyone explore live job market demand by domain and
                role — independent of a career assessment.
              </p>
              <SubHeading>User Flow</SubHeading>
              <div className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5 font-mono text-sm text-zinc-400">
                Select Domain pill → Pick roles (multi-select) → Click Analyse →
                View top skills chart + domain competitiveness scores
              </div>
              <SubHeading>Outputs</SubHeading>
              <div className="space-y-2 mt-3">
                {MARKET_PAGE_OUTPUTS.map((o, i) => (
                  <InfoRow key={i} label={o.name} value={o.desc} />
                ))}
              </div>
              <SubHeading>Domains Available</SubHeading>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {[
                  "Technology & Engineering",
                  "Business & Management",
                  "Creative & Design",
                  "Science & Research",
                  "Healthcare & Medicine",
                  "Law & Policy",
                  "Education & Social",
                  "Media & Communication",
                  "Finance & Economics",
                  "Arts & Culture",
                  "Sports & Wellness",
                  "Trades & Skilled Work",
                ].map((d, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/[0.04] bg-zinc-950/30 px-3 py-2 text-xs text-zinc-400"
                  >
                    {d}
                  </div>
                ))}
              </div>
            </Section>

            {/* 13 */}
            <Section
              id="roadmap"
              num="13"
              title="Personalised Roadmap Generation"
            >
              <p className="mb-5">
                The roadmap is a structured 3-phase skill-building plan.
                Generated by the AI engine using the student&apos;s skill gap,
                target role, field of study, and experience level as input.
              </p>
              <div className="space-y-3">
                {[
                  {
                    phase: "Phase 1",
                    title: "Foundational Skill Building",
                    duration: "2–4 months",
                    desc: "Core skills the student is missing that are prerequisites for the role. Beginner-friendly courses and resources.",
                    color: "border-blue-500/20 bg-blue-500/[0.04]",
                    text: "text-blue-400",
                  },
                  {
                    phase: "Phase 2",
                    title: "Technical Skill Expansion",
                    duration: "4–6 months",
                    desc: "Intermediate skills, domain-specific tools, certifications, and real-world projects.",
                    color: "border-violet-500/20 bg-violet-500/[0.04]",
                    text: "text-violet-400",
                  },
                  {
                    phase: "Phase 3",
                    title: "Advanced & Market-Ready",
                    duration: "6–9 months",
                    desc: "Senior skills, system/process design thinking, interview preparation, portfolio projects, community contribution.",
                    color: "border-emerald-500/20 bg-emerald-500/[0.04]",
                    text: "text-emerald-400",
                  },
                ].map((p, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${p.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${p.text}`}
                      >
                        {p.phase}
                      </span>
                      <span className="text-[11px] text-zinc-600 font-mono">
                        {p.duration}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">
                      {p.title}
                    </p>
                    <p className="text-xs text-zinc-500">{p.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-500 mt-4">
                Each phase contains 3 specific, actionable tasks (not vague
                advice). The Roadmap card also includes an interactive Action
                Checklist where users can tick off completed tasks, with a
                progress bar that updates in real-time.
              </p>
            </Section>

            {/* 14 */}
            <Section id="tech-stack" num="14" title="Complete Technology Stack">
              <div className="grid sm:grid-cols-2 gap-3">
                {TECH_STACK.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.05] bg-zinc-950/40 px-5 py-4"
                  >
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">
                      {t.category}
                    </p>
                    <p className="text-sm text-zinc-300">{t.items}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 15 */}
            <Section id="data" num="15" title="Data Models & Types">
              <p className="mb-4 text-sm text-zinc-400">
                All TypeScript types are defined in{" "}
                <code className="text-blue-400 font-mono text-xs">
                  frontend/lib/types.ts
                </code>
                . The Flask backend mirrors these as Python dicts.
              </p>
              <SubHeading>Input Types</SubHeading>
              <div className="space-y-2 mb-5">
                {INPUT_TYPES.map((t, i) => (
                  <InfoRow key={i} label={t.name} value={t.fields} />
                ))}
              </div>
              <SubHeading>Response Types</SubHeading>
              <div className="space-y-2">
                {RESPONSE_TYPES.map((t, i) => (
                  <InfoRow key={i} label={t.name} value={t.fields} />
                ))}
              </div>
            </Section>

            {/* 16 */}
            <Section id="decisions" num="16" title="Key Design Decisions">
              <div className="space-y-4">
                {DESIGN_DECISIONS.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5"
                  >
                    <p className="text-sm font-semibold text-white mb-2">
                      {d.decision}
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {d.reason}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 17 */}
            <Section
              id="limitations"
              num="17"
              title="Limitations & Future Work"
            >
              <SubHeading>Current Limitations</SubHeading>
              <ul className="space-y-2 mb-6">
                {[
                  "ML model trained on synthetic data — real-world accuracy improves significantly with real student datasets",
                  "Adzuna API India has limited coverage for non-tech roles — mock fallback activates frequently for law, healthcare, arts domains",
                  "Single-session only — no user accounts, history, or progress tracking between sessions",
                  "Roadmap generated fresh per session — not connected to verified learning platform catalogs",
                  "YouTube API quota limits — high traffic may exhaust daily quota (10,000 units), falls back to curated-only resources",
                ].map((l, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="text-yellow-500/70 shrink-0 mt-0.5">
                      ⚠
                    </span>
                    <span className="text-zinc-400">{l}</span>
                  </li>
                ))}
              </ul>
              <SubHeading>Planned Improvements</SubHeading>
              <ul className="space-y-2">
                {[
                  "User authentication + saved reports with version history",
                  "LinkedIn OAuth to auto-populate skills from student profile",
                  "Real student dataset collection → retrain model with ground-truth data",
                  "PDF export of the complete 3-act intelligence report",
                  "Course API integrations (Coursera, Udemy official APIs) for verified recommendations",
                  "Multi-language support (Hindi, Tamil, Telugu)",
                  "WebSocket-based streaming for real-time report generation progress",
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                    <span className="text-zinc-400">{p}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* 18 */}
            <Section
              id="quick-ref"
              num="18"
              title="Quick Reference — Numbers That Matter"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_NUMBERS.map((n, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-white mb-1">
                      {n.value}
                    </p>
                    <p className="text-[11px] text-zinc-500">{n.label}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────── Data Constants ─────────── */

const TOC_ITEMS = [
  { id: "overview", label: "Project Overview" },
  { id: "problem", label: "Problem Statement" },
  { id: "architecture", label: "System Architecture" },
  { id: "frontend", label: "Frontend — Next.js" },
  { id: "backend", label: "Backend — Flask API" },
  { id: "profile-processor", label: "Profile Processor Module" },
  { id: "cri", label: "Career Readiness Index (CRI)" },
  { id: "ml", label: "ML Model — Career Prediction" },
  { id: "dual-track", label: "Dual-Track Analysis" },
  { id: "market", label: "Market Engine — Adzuna API" },
  { id: "ai", label: "AI Engine — Groq / LLaMA 3" },
  { id: "market-page", label: "Market Intelligence Page" },
  { id: "roadmap", label: "Roadmap Generation" },
  { id: "tech-stack", label: "Technology Stack" },
  { id: "data", label: "Data Models & Types" },
  { id: "decisions", label: "Key Design Decisions" },
  { id: "limitations", label: "Limitations & Future Work" },
  { id: "quick-ref", label: "Quick Reference Numbers" },
];

const ARCHITECTURE_STEPS = [
  {
    name: "User Input — 4-Step Assessment",
    tech: "React / Next.js 16",
    desc: "Academic, Experience & Skills, Career Goal, Personality — collected as structured JSON over a streamlined 4-step wizard UI",
  },
  {
    name: "POST /api/analyze",
    tech: "Flask REST API",
    desc: "Single endpoint receives the full student profile object and orchestrates all processing modules with parallelised execution",
  },
  {
    name: "Profile Processor",
    tech: "profile_processor.py",
    desc: "Normalises, vectorises, and scores raw input. Computes personality dimension scores, interest clusters, career vectors, and skill matching",
  },
  {
    name: "Phase A — Parallel Compute & Fetch",
    tech: "ThreadPoolExecutor (4 workers)",
    desc: "ML prediction, Adzuna job fetch, CRI calculation, and role description (LLM) — all execute simultaneously in ~3–4s",
  },
  {
    name: "Phase B — Parallel LLM Generation",
    tech: "Groq Cloud (LLaMA 3 70B)",
    desc: "4 Groq calls in parallel: roadmap, bridge sentence, executive summary, action checklist — completes in ~3–5s",
  },
  {
    name: "Resource Enrichment",
    tech: "resource_map.py + YouTube API v3",
    desc: "241-skill map lookup + parallel YouTube API calls enrich every roadmap action with curated learning resources",
  },
  {
    name: "JSON Response → 3-Act Report",
    tech: "Next.js 16 / Framer Motion",
    desc: "Full AnalysisResponse JSON returned to frontend. 3-act report renders with premium glass-morphism UI and entrance animations",
  },
];

const INPUT_MODULES = [
  {
    name: "Academic Profile",
    desc: "Student identity and academic background — streamlined from the original Identity module",
    fields:
      "name, field_of_study, cgpa, consistency ('low'|'medium'|'high'), backlogs",
  },
  {
    name: "Experience & Skills",
    desc: "All experience and skills in one step — merged from the original Experience + Skills modules for faster completion",
    fields:
      "selected_skills[], proficiency_rating (1–10), languages_known[], internships, projects, leadership, competitions, volunteer, earned_from_skill, readiness_rating",
  },
  {
    name: "Career Goal",
    desc: "Target career and enjoyed activities — merged from the original Intent + Interests modules",
    fields: "target_domain, target_role, activities[]",
  },
  {
    name: "Personality",
    desc: "8 forced-choice A/B questions mapping to 5 bipolar dimensions (no neutral options — prevents fence-sitting)",
    fields:
      "answers: Record<string, 'A'|'B'> — 8 entries mapped to 5 dimension scores",
  },
];

const RESULT_COMPONENTS = [
  {
    name: "Act I — Profile Snapshot",
    desc: "Glass summary card with identity + profile ID, bidirectional personality spectrum bars (5 dimensions), interest cluster signals, AI bridge sentence",
  },
  {
    name: "Act II — Career Analysis",
    desc: "Animated CRI ring (SVG donut) + 4 sub-index bars, Track A best-fit card with gradient styling, Track B chosen career with alignment bars + skill gaps + market chart, 2nd/3rd fit cards",
  },
  {
    name: "Act III — Action Path",
    desc: "3-phase gradient roadmap timeline with enriched resource links per action, interactive checklist with live progress bar, top 5 job cards with contextual match labels, AI executive summary",
  },
];

const BACKEND_MODULES = [
  {
    file: "app.py",
    desc: "Flask application entry point. Defines 4 routes, handles CORS, orchestrates all modules using 2-phase ThreadPoolExecutor parallelisation (~8–12s total).",
  },
  {
    file: "profile_processor.py",
    desc: "Normalises all input data. Computes personality scores, interest clusters, career vectors, skill matching. Returns processed dict.",
  },
  {
    file: "cri_calculator.py",
    desc: "Implements the full CRI formula with all 4 sub-indices. Returns cri_total, sub-scores, and projected CRI.",
  },
  {
    file: "ai_engine.py",
    desc: "Groq API wrapper with 5 functions: generate_role_description, generate_executive_summary, generate_roadmap, generate_action_checklist, generate_bridge_sentence.",
  },
  {
    file: "market_engine.py",
    desc: "Adzuna API client. Fetches live listings (parallel per role), extracts skills via regex, ranks jobs by match score, computes domain competitiveness.",
  },
  {
    file: "resource_map.py",
    desc: "241-skill resource map + YouTube Data API v3 integration. Smart matching (exact → partial → domain fallback). Parallel YouTube calls for enrichment.",
  },
  {
    file: "model/train_model.py",
    desc: "Offline training script. Generates 1,200 synthetic student profiles, trains RandomForestClassifier, saves as career_model.pkl.",
  },
  {
    file: "model/__init__.py",
    desc: "Model loader. Loads the serialised .pkl model at app startup using joblib — avoids per-request loading overhead.",
  },
  {
    file: "data/career_dataset.csv",
    desc: "Synthetic training dataset with 1,200 rows. Columns: all feature fields + target (career role label).",
  },
];

const CRI_FORMULAE = [
  {
    name: "Academic Reliability Index",
    weight: "25%",
    formula: "((CGPA / 10) × 15) + consistency_bonus − backlog_penalty",
    notes:
      "Consistency bonus: High = +5, Medium = +3, Low = +0. Backlog penalty = −3 per backlog (max −10). Final value normalised to 0–25 range.",
  },
  {
    name: "Skill Depth Index",
    weight: "30%",
    formula:
      "(skills_count × 2) + (proficiency_rating × 1.5) + (languages_known × 1)",
    notes:
      "Rewards both breadth (more skills) and depth (higher self-rated proficiency). Multiple programming languages add bonus. Normalised to 0–30.",
  },
  {
    name: "Experience Adequacy Index",
    weight: "30%",
    formula:
      "(internships × 8) + (projects_count × 3) + competition_bonus + leadership_bonus + volunteer_bonus",
    notes:
      "Internships weighted highest (real-world validated exposure). Competitions +5 pts. Leadership role +4. Volunteer work +2. Normalised to 0–30.",
  },
  {
    name: "Market Alignment Score",
    weight: "15%",
    formula: "(matched_market_skills / total_demanded_skills) × 15",
    notes:
      "Computed from live Adzuna listings for the student's target role. Measures: how many currently-demanded skills does the student already have?",
  },
];

const AI_OUTPUTS = [
  {
    name: "Role Description",
    desc: "2-paragraph professional description of the chosen career — day-to-day responsibilities, work environment, career progression trajectory",
  },
  {
    name: "Executive Summary",
    desc: "~200-word personalised analysis of the student's full career intelligence profile — strengths, gaps, alignment level, and market outlook",
  },
  {
    name: "3-Phase Roadmap",
    desc: "Three titled phases with 3 specific tasks each, directly tied to the student's actual missing skills identified in the analysis",
  },
  {
    name: "Action Checklist",
    desc: "6 specific, time-bound, actionable tasks formatted as a checklist — items are role-specific and prioritised by impact",
  },
  {
    name: "Bridge Sentence",
    desc: "Transitional insight connecting Track A (Best Fit) and Track B (Chosen Career) findings, incorporating personality context",
  },
];

const MARKET_PAGE_OUTPUTS = [
  {
    name: "Top Skills Bar Chart",
    desc: "Horizontal bar chart of most demanded skills across selected roles, ranked by frequency across live job listings",
  },
  {
    name: "Domain Competitiveness Score",
    desc: "0–100 score representing how competitive each domain is — based on skill density and demand depth in live listings",
  },
  {
    name: "Summary Statistics",
    desc: "Top demanded skill, most competitive domain, and total roles analysed in this run",
  },
  {
    name: "Roles Analysed List",
    desc: "Exact role names whose Adzuna listings were fetched and analysed for this market intelligence report",
  },
];

const TECH_STACK = [
  {
    category: "Frontend Framework",
    items: "Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5",
  },
  {
    category: "Styling",
    items:
      "TailwindCSS v4 · Custom CSS variables · shadcn/ui components · Glass-morphism UI",
  },
  {
    category: "Animations",
    items:
      "Framer Motion 11 — transitions, step animations, SVG gauges, spring physics",
  },
  {
    category: "Charts & Visualisation",
    items: "Recharts — horizontal bar charts for skill demand data",
  },
  {
    category: "Backend Framework",
    items: "Python 3.11 · Flask 3.x · Flask-CORS · Gunicorn (production)",
  },
  {
    category: "Parallelisation",
    items:
      "concurrent.futures.ThreadPoolExecutor — 2-phase parallel pipeline (~8–12s)",
  },
  {
    category: "ML / Data Science",
    items: "scikit-learn · pandas · numpy · joblib",
  },
  {
    category: "AI Text Generation",
    items:
      "Groq Cloud SDK · LLaMA 3 70B (llama3-70b-8192) · 5 generation tasks",
  },
  {
    category: "Market Data",
    items:
      "Adzuna Jobs API v1 · India endpoint (country: in) · 180+ role→domain hints",
  },
  {
    category: "Learning Resources",
    items:
      "YouTube Data API v3 · 241-skill resource map · 6 learning platforms",
  },
  {
    category: "Environment & Deployment",
    items:
      "python-dotenv · Vercel (frontend) · Render (backend) · Keep-alive daemon",
  },
  {
    category: "Dev & Build Tools",
    items: "VS Code · ESLint · Prettier · Git · npm",
  },
];

const INPUT_TYPES = [
  {
    name: "AcademicProfile",
    fields:
      "name (string), field_of_study (string), cgpa (number), consistency ('low'|'medium'|'high'), backlogs (number)",
  },
  {
    name: "ExperienceSkillsProfile",
    fields:
      "selected_skills: string[], proficiency_rating (1–10), languages_known: string[], internships (number), projects (number), leadership (boolean), competitions (boolean), volunteer (boolean), earned_from_skill (boolean), readiness_rating (1–10)",
  },
  {
    name: "CareerGoalProfile",
    fields:
      "target_domain (string), target_role (string), activities: string[]",
  },
  {
    name: "PersonalityProfile",
    fields:
      "answers: Record<string, 'A' | 'B'> — 8 entries, one per personality question",
  },
  {
    name: "StudentProfile",
    fields:
      "{ academic: AcademicProfile, experience_skills: ExperienceSkillsProfile, career_goal: CareerGoalProfile, personality: PersonalityProfile }",
  },
];

const RESPONSE_TYPES = [
  {
    name: "AnalysisResponse",
    fields:
      "identity, interest_profile, best_fit, chosen_career, cri, jobs[], executive_summary (string), action_checklist: string[], bridge_sentence (string)",
  },
  {
    name: "BestFitCareer",
    fields:
      "role, score (%), why (string), strengths[], skills_to_develop[], salary_range, growth_trajectory, market_demand, second_fit, third_fit",
  },
  {
    name: "ChosenCareerAnalysis",
    fields:
      "role, interest_match (%), skill_match (%), experience_match (%), alignment_score (%), role_description, market_data{}, you_have[], missing_skills[], gap_severity, gap_timeline, roadmap{phase_1, phase_2, phase_3}",
  },
  {
    name: "CRIResult",
    fields:
      "cri_total (number), academic_reliability_index, skill_depth_index, experience_adequacy_index, market_alignment_score, projected_cri",
  },
  {
    name: "JobResult",
    fields:
      "title, company, location, apply_url, match_percentage (number), salary",
  },
  {
    name: "InterestProfileResult",
    fields:
      "personality: Record<dimension, score>, interest_clusters: {name, strength}[], motivators: string[]",
  },
];

const DESIGN_DECISIONS = [
  {
    decision: "Single-page state machine instead of multi-step URL routes",
    reason:
      "All 4 assessment steps share the same form state. Using URL routes would require complex state serialisation into query strings or a session store. A client-side state machine (view: hero | input | loading | results) keeps all data in memory, prevents back-button issues mid-assessment, and provides instant transitions.",
  },
  {
    decision: "4-step form consolidation (from 6 steps)",
    reason:
      "The original 6-step assessment had higher abandonment rates. Merging Identity + Academic → Step 1, Experience + Skills → Step 2, and Intent + Interests → Step 3 reduced friction by 33% while preserving all analytical signal. Personality remains Step 4 (cannot be merged without compromising the forced-choice UX).",
  },
  {
    decision: "AI as presentation layer only — not as the analysis engine",
    reason:
      "If the LLM computed scores, results would be non-reproducible and potentially hallucinated. By making the Python backend compute all numeric scores deterministically, the LLM only formats pre-computed data into readable prose. This makes the system auditable, debuggable, and trustworthy for high-stakes career decisions.",
  },
  {
    decision: "2-phase parallelised backend (ThreadPoolExecutor)",
    reason:
      "Sequential execution of 5 LLM calls + API fetches + YouTube enrichment took ~30 seconds. Grouping independent operations into ThreadPoolExecutor phases (Phase A: ML + Adzuna + CRI + role desc; Phase B: 4 LLM calls; Phase C: YouTube) reduced total time to ~8–12s — a 3× improvement with zero additional dependencies (uses stdlib concurrent.futures).",
  },
  {
    decision: "Random Forest over deep learning for career prediction",
    reason:
      "Deep learning requires datasets of 10,000+ samples. Our synthetic dataset has 1,200 rows. Random Forest performs excellently on small tabular datasets, is inherently interpretable via feature importances, trains in seconds, and runs inference in microseconds — making it ideal for a web API with real-time response requirements.",
  },
  {
    decision: "Synthetic training data instead of real student data",
    reason:
      "Collecting real labelled student-career data requires ethics approval, privacy handling, and months of time. Synthetic data enables full pipeline prototyping. The system is designed for easy retraining — replace career_dataset.csv with real data and re-run train_model.py. The architecture is real-data-ready.",
  },
  {
    decision: "Dual-track career analysis (Track A vs Track B)",
    reason:
      "Students often choose careers based on social pressure rather than genuine fit. Showing both what the data recommends (Track A) and what the student wants (Track B) creates a productive evidence-based conversation — validating good choices or surfacing misalignment without being dismissive of the student's aspirations.",
  },
  {
    decision: "Domain relevance gate for Adzuna API results",
    reason:
      "The Indian Adzuna market is dominated by tech listings. A search for 'Nurse', 'Lawyer', or 'Graphic Designer' returns mostly software engineering jobs. A relevance gate (≥20% domain-expected skills in results) detects off-domain results and substitutes curated mock job descriptions — ensuring market data is always domain-appropriate and meaningful.",
  },
  {
    decision: "241-skill resource map with YouTube API over static links",
    reason:
      "A smart matching engine (exact → partial → domain fallback) enriches every roadmap action with real platform links across 6 learning platforms. YouTube API v3 makes video resources dynamic and always current. Static links go stale; this approach ensures resources stay relevant.",
  },
  {
    decision: "Premium glass-morphism report UI",
    reason:
      "Career reports should feel important. Glass panels, gradient cards, animated CRI rings, and spring-physics entrance animations create a premium experience that makes students want to read and share their report — increasing engagement with actionable recommendations.",
  },
];

const QUICK_NUMBERS = [
  { value: "4", label: "Assessment steps" },
  { value: "12", label: "Career domains" },
  { value: "192", label: "Total career roles" },
  { value: "3", label: "Report acts" },
  { value: "241", label: "Skills mapped" },
  { value: "4", label: "API endpoints" },
  { value: "1,200", label: "ML training samples" },
  { value: "100", label: "Random Forest trees" },
  { value: "4", label: "CRI sub-dimensions" },
  { value: "3", label: "Roadmap phases" },
  { value: "5", label: "Personality dimensions" },
  { value: "~10s", label: "Analysis time" },
];

/* ─────────── UI Sub-Components ─────────── */

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 text-[11px] font-bold font-mono text-blue-400 shrink-0">
          {num}
        </span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-6 mb-3">
      {children}
    </h3>
  );
}

function InfoGrid({
  items,
  className = "",
}: {
  items: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <InfoRow key={i} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-0.5 sm:gap-3 rounded-lg border border-white/[0.04] bg-zinc-950/30 px-4 py-3">
      <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 sm:shrink-0 sm:w-44 leading-5 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs text-zinc-300 leading-5">{value}</span>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  desc,
  input,
  output,
}: {
  method: string;
  path: string;
  desc: string;
  input: string;
  output: string;
}) {
  const color =
    method === "POST"
      ? "text-blue-400 bg-blue-500/10 border-blue-500/30"
      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  return (
    <div className="rounded-xl border border-white/[0.05] bg-zinc-950/40 p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${color}`}
        >
          {method}
        </span>
        <code className="text-sm font-mono text-white">{path}</code>
      </div>
      <p className="text-xs text-zinc-400 mb-3">{desc}</p>
      <div className="space-y-1.5">
        <div className="flex gap-2 text-xs">
          <span className="text-zinc-600 w-10 shrink-0">Input:</span>
          <span className="text-zinc-400">{input}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-zinc-600 w-10 shrink-0">Output:</span>
          <span className="text-zinc-400">{output}</span>
        </div>
      </div>
    </div>
  );
}

const PROFILE_PROCESSOR_STEPS = [
  "Extracts and validates all 4 input step fields from the raw POST body",
  "Computes 5 personality dimension scores (0–100 each) from the 8 A/B answers",
  "Maps selected activities to 5 interest clusters with signal strength (strong / moderate / emerging)",
  "Builds a skill vector — total count, category breakdown, and normalised breadth score",
  "Detects target domain from stated role name using a 100+ keyword-to-domain lookup",
  "Computes career alignment vectors for matching the chosen role to the student profile",
  "Returns a single flat 'processed' dictionary consumed by all downstream modules",
];
