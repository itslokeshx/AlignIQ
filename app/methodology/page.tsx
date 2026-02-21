"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-flex rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-4">
              Technical Documentation
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Methodology
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-xl">
              Every number has a formula. Every API call has a reason.
              Here&apos;s how ALIGNIQ works under the hood.
            </p>
          </div>

          <div className="space-y-16">
            {/* 1. Problem Statement */}
            <Section num={1} title="Problem Statement">
              <p>
                Final-year engineering students face a critical misalignment problem: 
                their skills, interests, and career choices rarely converge. Traditional 
                placement systems measure only GPA, ignoring market signals, skill depth, 
                and passion alignment. ALIGNIQ bridges this gap with a data-driven, 
                multi-dimensional career readiness assessment.
              </p>
            </Section>

            {/* 2. System Architecture */}
            <Section num={2} title="System Architecture">
              <p className="mb-6">
                ALIGNIQ follows a modular pipeline architecture where each stage produces 
                structured data for the next.
              </p>
              <ArchitectureDiagram />
            </Section>

            {/* 3. CRI Formula */}
            <Section num={3} title="Career Readiness Index (CRI)">
              <p className="mb-4">
                The CRI is a custom composite metric scored out of 100, computed as a weighted 
                sum of four sub-indices:
              </p>

              <div className="rounded-lg border border-border bg-secondary/30 p-4 font-mono text-sm text-foreground mb-6">
                CRI = (Academic × 0.25) + (Skills × 0.30) + (Experience × 0.25) + (Market × 0.20)
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Weights are chosen based on industry hiring patterns — skills and experience 
                together carry 55% because employers prioritize demonstrated capability over grades.
              </p>

              <div className="space-y-4">
                <FormulaCard
                  title="Academic Score"
                  formula="(CGPA/10 × 50) + (Aptitude/100 × 30) + Backlog Penalty + Consistency Bonus"
                  notes="Backlog penalty: -10 per backlog (max -30). Consistency: High=+20, Medium=+10, Low=+0"
                />
                <FormulaCard
                  title="Skill Score"
                  formula="(Languages × 5) + (Frameworks × 7) + (Tools × 5) + (Self-Rating × 3)"
                  notes="Frameworks weighted higher (7 vs 5) as they indicate applied knowledge. Capped at 100."
                />
                <FormulaCard
                  title="Experience Score"
                  formula="(Internships × 20) + (Projects × 10) + (Hackathons × 8) + (Leadership × 12)"
                  notes="Internships weighted highest as they represent real-world exposure. Capped at 100."
                />
                <FormulaCard
                  title="Market Match Score"
                  formula="(Matched Skills / Total Demanded Skills) × 100"
                  notes="Computed from real-time Adzuna job descriptions for the target role."
                />
              </div>
            </Section>

            {/* 4. ML Model */}
            <Section num={4} title="ML Model — Career Prediction">
              <p className="mb-4">
                We use a <strong className="text-foreground">Random Forest Classifier</strong> trained 
                on a synthetic dataset of 1,200 student profiles across 6 career domains.
              </p>

              <div className="space-y-3 mb-6">
                <MetricRow label="Algorithm" value="Random Forest (100 trees, max_depth=12)" />
                <MetricRow label="Training Split" value="80% train / 20% test" />
                <MetricRow label="Features" value="CGPA, Backlogs, Aptitude, Consistency, Internships, Projects, Hackathons, Leadership, Skills Count, Self-Rating" />
                <MetricRow label="Classes" value="AI/ML Engineer, Full Stack Developer, Data Scientist, DevOps Engineer, Cybersecurity Analyst, Embedded Systems Engineer" />
              </div>

              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why Random Forest?</strong> It combines multiple 
                decision trees to reduce overfitting. It also provides feature importance scores, 
                allowing us to show exactly which factors most influenced the prediction. Interpretability 
                matters for a career guidance system — students need to trust and understand the output.
              </p>
            </Section>

            {/* 5. Alignment Calculation */}
            <Section num={5} title="Alignment Calculation — Cosine Similarity">
              <p className="mb-4">
                We represent skills, interests, and career roles as numerical vectors in a 
                6-dimensional domain space (AI/ML, Web Dev, Data Science, Cloud/DevOps, 
                Cybersecurity, Core Engineering).
              </p>

              <div className="rounded-lg border border-border bg-secondary/30 p-4 font-mono text-sm text-foreground mb-6">
                cos(θ) = (A · B) / (‖A‖ × ‖B‖)
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Cosine similarity measures the cosine of the angle between two vectors. 
                A value of 1 means identical direction (perfect alignment), 0 means orthogonal 
                (no relation).
              </p>

              <div className="space-y-3">
                <MetricRow label="Passion Alignment" value="Student Skills ↔ Interested Domains" />
                <MetricRow label="Role Alignment" value="Student Skills ↔ Target Role Requirements" />
                <MetricRow label="Passion vs Choice" value="Interested Domains ↔ Target Role" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                A passion_vs_choice score below 0.4 triggers the misalignment warning, indicating 
                the student&apos;s interests and chosen target role are pulling in significantly 
                different directions.
              </p>
            </Section>

            {/* 6. Market Integration */}
            <Section num={6} title="Market Integration — Adzuna API">
              <p className="mb-4">
                Real-time job market data is fetched from the Adzuna API (India endpoint).
              </p>

              <div className="space-y-3 mb-4">
                <MetricRow label="Endpoint" value="api.adzuna.com/v1/api/jobs/in/search" />
                <MetricRow label="Method" value="Keyword extraction via pattern matching against 40+ known skills" />
                <MetricRow label="Ranking" value="Jobs ranked by percentage of student skills found in description" />
                <MetricRow label="Output" value="Top 5 highest-match jobs with apply links" />
              </div>

              <p className="text-sm text-muted-foreground">
                Skill extraction uses simple string matching against a curated list of 40+ 
                technology keywords. This approach is deterministic and explainable, unlike 
                NLP-based extraction which adds unnecessary complexity for this use case.
              </p>
            </Section>

            {/* 7. AI Layer */}
            <Section num={7} title="AI Layer — Groq (LLaMA 3)">
              <p className="mb-4">
                The AI layer is a <strong className="text-foreground">presentation layer, not an analysis layer</strong>.
              </p>

              <div className="space-y-3 mb-6">
                <MetricRow label="Provider" value="Groq Cloud (LLaMA 3 70B)" />
                <MetricRow label="Temperature" value="0.3 (deterministic, factual output)" />
                <MetricRow label="Input" value="Pre-computed CRI, ML predictions, alignment scores, market data" />
                <MetricRow label="Output" value="Executive summary, 3-phase roadmap, skill prescriptions" />
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-foreground font-medium mb-1">Key Design Decision</p>
                <p className="text-sm text-muted-foreground">
                  The AI does NOT perform the analysis. Our ML model and CRI formulas compute all 
                  scores. Groq receives structured, already-computed results and formats them into 
                  professional readable text. The intelligence is in the backend logic, not the AI. 
                  This makes the system explainable, reproducible, and trustworthy.
                </p>
              </div>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/* ─── Sub-components ─── */

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
          {num}
        </span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

function FormulaCard({ title, formula, notes }: { title: string; formula: string; notes: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
      <p className="font-mono text-xs text-primary mb-2">{formula}</p>
      <p className="text-xs text-muted-foreground">{notes}</p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-2.5">
      <span className="text-xs font-medium text-muted-foreground shrink-0 w-32">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  )
}

function ArchitectureDiagram() {
  const steps = [
    { label: "Student Input", desc: "4 profile modules" },
    { label: "Profile Processor", desc: "Normalize & vectorize" },
    { label: "ML Engine", desc: "RandomForest + Cosine Sim" },
    { label: "Market Engine", desc: "Adzuna API integration" },
    { label: "CRI Calculator", desc: "Weighted composite score" },
    { label: "AI Engine", desc: "Groq formatting layer" },
    { label: "Results Dashboard", desc: "8 visualization components" },
  ]

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
            {i + 1}
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{step.label}</span>
            <span className="text-xs text-muted-foreground">{step.desc}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="absolute left-[22px] translate-y-full">
              <svg width="8" height="16" viewBox="0 0 8 16" fill="none" className="text-muted-foreground/30">
                <path d="M4 0V16" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
