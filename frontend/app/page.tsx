"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AcademicModule } from "@/components/input-modules/academic-module";
import { ExperienceModule } from "@/components/input-modules/experience-module";
import { SkillsModule } from "@/components/input-modules/skills-module";
import { IntentModule } from "@/components/input-modules/intent-module";
import { CRIScore } from "@/components/results/cri-score";
import { AlignmentVisual } from "@/components/results/alignment-visual";
import { CareerPrediction } from "@/components/results/career-prediction";
import { MisalignmentWarning } from "@/components/results/misalignment-warning";
import { GapRadarChart } from "@/components/results/gap-radar-chart";
import { AIExecutiveSummary } from "@/components/results/ai-executive-summary";
import { ExecutionRoadmap } from "@/components/results/execution-roadmap";
import { JobOpportunities } from "@/components/results/job-opportunities";
import type {
  StudentProfile,
  AcademicProfile,
  ExperienceProfile,
  SkillsProfile,
  IntentProfile,
  AnalysisResponse,
} from "@/lib/types";

type ViewState = "hero" | "input" | "loading" | "results";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomePage() {
  const [view, setView] = useState<ViewState>("hero");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [academic, setAcademic] = useState<AcademicProfile>({
    cgpa: 7.5,
    backlogs: 0,
    aptitude_score: 65,
    consistency: "medium",
  });

  const [experience, setExperience] = useState<ExperienceProfile>({
    internships: 1,
    projects: 3,
    hackathons: 1,
    leadership: false,
  });

  const [skills, setSkills] = useState<SkillsProfile>({
    selected_skills: [],
    self_rating: 6,
  });

  const [intent, setIntent] = useState<IntentProfile>({
    interested_domains: [],
    target_role: "",
    salary_expectation: 8,
    work_style: "hybrid",
    risk_tolerance: "medium",
  });

  const handleAnalyze = async () => {
    setError(null);
    setView("loading");

    const payload: StudentProfile = {
      academic,
      experience,
      skills,
      intent,
    };

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Analysis failed (${res.status})`);
      }

      const data: AnalysisResponse = await res.json();
      setResults(data);
      setView("results");
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(
        err.message ||
          "Failed to analyze profile. Make sure the backend is running.",
      );
      setView("input");
    }
  };

  const handleReset = () => {
    setResults(null);
    setView("hero");
    setError(null);
  };

  const modules = [
    {
      num: 1,
      title: "Academic Profile",
      desc: "GPA, aptitude, and consistency metrics",
      content: <AcademicModule data={academic} onChange={setAcademic} />,
    },
    {
      num: 2,
      title: "Experience Depth",
      desc: "Internships, projects, and leadership",
      content: <ExperienceModule data={experience} onChange={setExperience} />,
    },
    {
      num: 3,
      title: "Skills Stack",
      desc: "Technical skills and self-assessment",
      content: <SkillsModule data={skills} onChange={setSkills} />,
    },
    {
      num: 4,
      title: "Career Intent",
      desc: "Domains, role targets, and preferences",
      content: <IntentModule data={intent} onChange={setIntent} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* ─── HERO STATE ─── */}
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6"
            >
              {/* Dot grid background */}
              <div className="dot-grid-bg pointer-events-none absolute inset-0" />

              <div className="relative z-10 max-w-2xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    Adaptive Intelligence System
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
                >
                  Career Alignment
                  <br />
                  <span className="text-primary">Intelligence</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-4 text-base text-muted-foreground sm:text-lg max-w-lg mx-auto"
                >
                  Measure your readiness. Align with the market.
                  <br />
                  Execute strategically.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-8"
                >
                  <button
                    onClick={() => setView("input")}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                  >
                    Begin Assessment
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 3L11 8L6 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── INPUT STATE ─── */}
          {view === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl px-6 py-12"
            >
              <div className="mb-8">
                <button
                  onClick={() => setView("hero")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 3L5 8L10 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  Profile Assessment
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete all four modules for comprehensive career analysis.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {modules.map((mod, i) => (
                  <motion.div
                    key={mod.num}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                          {mod.num}
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {mod.desc}
                          </p>
                        </div>
                      </div>
                      {mod.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Analyze button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={
                    skills.selected_skills.length === 0 || !intent.target_role
                  }
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyze My Profile →
                </button>
                {(skills.selected_skills.length === 0 ||
                  !intent.target_role) && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Select at least one skill and enter a target role to
                    continue
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ─── LOADING STATE ─── */}
          {view === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-4"
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Analyzing your profile...
              </p>
              <p className="text-xs text-muted-foreground/60">
                Running ML prediction, market analysis & AI synthesis
              </p>
            </motion.div>
          )}

          {/* ─── RESULTS STATE ─── */}
          {view === "results" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-5xl px-6 py-12"
            >
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Analysis Results
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive career readiness assessment
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  New Assessment
                </button>
              </div>

              <div className="space-y-6">
                {/* Row 1: CRI + Alignment */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <CRIScore data={results.cri} />
                  <AlignmentVisual data={results.alignment} />
                </div>

                {/* Misalignment warning */}
                <MisalignmentWarning
                  data={results.alignment}
                  predictedCareer={results.ml.predicted_career}
                  targetRole={intent.target_role}
                />

                {/* Row 2: Career Prediction + Radar */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <CareerPrediction data={results.ml} />
                  <GapRadarChart data={results.cri} />
                </div>

                {/* AI Summary */}
                <AIExecutiveSummary data={results.ai} />

                {/* Execution Roadmap */}
                <ExecutionRoadmap data={results.ai} />

                {/* Job Opportunities */}
                <JobOpportunities jobs={results.jobs} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
