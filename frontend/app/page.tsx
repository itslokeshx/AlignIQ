"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// ── Input modules ──────────────────────────────────────────────────────────────
import IdentityModule from "@/components/input-modules/identity-module";
import InterestsModule from "@/components/input-modules/interests-module";
import ExperienceModule from "@/components/input-modules/experience-module";
import SkillsModule from "@/components/input-modules/skills-module";
import IntentModule from "@/components/input-modules/intent-module";
import PersonalityModule from "@/components/input-modules/personality-module";

// ── Result components ─────────────────────────────────────────────────────────
import InterestProfileCard from "@/components/results/interest-profile";
import BestFitCareerCard from "@/components/results/best-fit-career";
import ChosenCareerCard from "@/components/results/chosen-career-analysis";
import { CRIScore } from "@/components/results/cri-score";
import { JobOpportunities } from "@/components/results/job-opportunities";
import ExecutiveSummary from "@/components/results/executive-summary";
import ActionChecklist from "@/components/results/action-checklist";

import type {
  IdentityProfile,
  InterestsProfile,
  ExperienceProfile,
  SkillsProfile,
  IntentProfile,
  PersonalityProfile,
  StudentProfile,
  AnalysisResponse,
} from "@/lib/types";

type ViewState = "hero" | "input" | "loading" | "results";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STEPS = [
  { num: 1, title: "Academic Profile", desc: "GPA, aptitude & consistency" },
  {
    num: 2,
    title: "Experience Depth",
    desc: "Internships, projects & leadership",
  },
  { num: 3, title: "Skills Stack", desc: "Technologies & self-assessment" },
  { num: 4, title: "Career Intent", desc: "Goals, domains & preferences" },
];

export default function HomePage() {
  const [view, setView] = useState<ViewState>("hero");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
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
    setStep(1);
    setView("hero");
    setError(null);
  };

  const handleNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    if (step === 1) {
      setView("hero");
    } else {
      setDirection(-1);
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const canProceed = () => {
    if (step === 3) return skills.selected_skills.length > 0;
    if (step === 4) return !!intent.target_role;
    return true;
  };

  const stepContent = [
    <AcademicModule key="academic" data={academic} onChange={setAcademic} />,
    <ExperienceModule
      key="experience"
      data={experience}
      onChange={setExperience}
    />,
    <SkillsModule key="skills" data={skills} onChange={setSkills} />,
    <IntentModule key="intent" data={intent} onChange={setIntent} />,
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
              className="mx-auto max-w-2xl px-6 py-12"
            >
              {/* ── Step progress header ── */}
              <div className="mb-8">
                <button
                  onClick={handleBack}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-1"
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
                  {step === 1 ? "Back to home" : "Previous"}
                </button>

                {/* Step labels */}
                <div className="flex items-center justify-between mb-3">
                  {STEPS.map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          s.num < step
                            ? "bg-success text-white"
                            : s.num === step
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {s.num < step ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5L4.5 7.5L8 3"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          s.num
                        )}
                      </span>
                      {s.num < STEPS.length && (
                        <div
                          className={`h-px w-12 sm:w-20 transition-colors ${s.num < step ? "bg-success/60" : "bg-border"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full rounded-full bg-secondary mb-5">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    animate={{
                      width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Step {step} of {STEPS.length}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {STEPS[step - 1].title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {STEPS[step - 1].desc}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* ── Animated step content ── */}
              <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {stepContent[step - 1]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Navigation buttons ── */}
              <div className="mt-6 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 rounded-xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
                  >
                    ← Back
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Analyze My Profile →
                  </button>
                )}
              </div>

              {!canProceed() && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {step === 3
                    ? "Select at least one skill to continue"
                    : "Enter a target role to continue"}
                </p>
              )}
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
