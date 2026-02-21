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
  { num: 1, title: "Who are you?", desc: "Identity & education" },
  {
    num: 2,
    title: "What moves you?",
    desc: "Activities, environments & drives",
  },
  { num: 3, title: "Your experience", desc: "Projects, internships & extras" },
  { num: 4, title: "Your skills", desc: "Domain skills & proficiency" },
  { num: 5, title: "Career intent", desc: "Goal role & motivations" },
  { num: 6, title: "Personality snapshot", desc: "8 quick questions" },
];

const LOADING_TEXTS = [
  "Analyzing your interest profile...",
  "Calculating career alignment vectors...",
  "Benchmarking against live market data...",
  "Generating your personalized roadmap...",
];

// ─── Animated loading text ────────────────────────────────────────────────────
function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState(1);
  useEffect(() => {
    const ids = LOADING_TEXTS.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 2), i * 1600),
    );
    return () => ids.forEach(clearTimeout);
  }, []);
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-6 px-6"
    >
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-blue-500"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="text-center space-y-2">
        {LOADING_TEXTS.slice(0, visibleLines).map((t, i) => (
          <motion.p
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${i === visibleLines - 1 ? "text-zinc-200" : "text-zinc-600"}`}
          >
            {t}
          </motion.p>
        ))}
      </div>
      <p className="text-xs text-zinc-600">This usually takes 10–20 seconds</p>
    </motion.div>
  );
}

export default function HomePage() {
  const [view, setView] = useState<ViewState>("hero");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── 6-module state ────────────────────────────────────────────────────────
  const [identity, setIdentity] = useState<IdentityProfile>({
    name: "",
    age: 21,
    education_level: "Undergraduate (pursuing)",
    field_of_study: "",
    cgpa: 7.5,
    consistency: "medium",
    backlogs: 0,
  });
  const [interests, setInterests] = useState<InterestsProfile>({
    activities: [],
    work_environments: [],
    motivators: [],
    topics: ["", "", ""],
  });
  const [experience, setExperience] = useState<ExperienceProfile>({
    internships: 0,
    projects: ["", "", ""],
    competitions: "",
    leadership: false,
    leadership_desc: "",
    volunteer: false,
    volunteer_desc: "",
    clubs: "",
    awards: "",
    readiness_rating: 5,
    earned_from_skill: false,
    earned_desc: "",
  });
  const [skills, setSkills] = useState<SkillsProfile>({
    selected_skills: [],
    proficiency_rating: 5,
    languages_known: [],
  });
  const [intent, setIntent] = useState<IntentProfile>({
    target_domain: "",
    target_role: "",
    reasons: [],
    salary_expectation: 10,
    work_location: "Hybrid",
    open_to_education: "Maybe later",
  });
  const [personality, setPersonality] = useState<PersonalityProfile>({
    answers: {},
  });

  const handleAnalyze = async () => {
    setError(null);
    setView("loading");
    const payload: StudentProfile = {
      identity,
      interests,
      experience,
      skills,
      intent,
      personality,
    };
    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const data: AnalysisResponse = await res.json();
      setResults(data);
      setView("results");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg + " — Make sure the backend is running.");
      setView("input");
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
    setView("hero");
    setError(null);
    setIdentity({
      name: "",
      age: 21,
      education_level: "Undergraduate (pursuing)",
      field_of_study: "",
      cgpa: 7.5,
      consistency: "medium",
      backlogs: 0,
    });
    setInterests({
      activities: [],
      work_environments: [],
      motivators: [],
      topics: ["", "", ""],
    });
    setExperience({
      internships: 0,
      projects: ["", "", ""],
      competitions: "",
      leadership: false,
      leadership_desc: "",
      volunteer: false,
      volunteer_desc: "",
      clubs: "",
      awards: "",
      readiness_rating: 5,
      earned_from_skill: false,
      earned_desc: "",
    });
    setSkills({
      selected_skills: [],
      proficiency_rating: 5,
      languages_known: [],
    });
    setIntent({
      target_domain: "",
      target_role: "",
      reasons: [],
      salary_expectation: 10,
      work_location: "Hybrid",
      open_to_education: "Maybe later",
    });
    setPersonality({ answers: {} });
  };

  const handleNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 6));
  };
  const handleBack = () => {
    if (step === 1) {
      setView("hero");
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const canProceed = () => {
    if (step === 1) return !!identity.name.trim() && !!identity.field_of_study;
    if (step === 2)
      return interests.activities.length > 0 && interests.motivators.length > 0;
    if (step === 4) return skills.selected_skills.length > 0;
    if (step === 5) return !!intent.target_role;
    if (step === 6) return Object.keys(personality.answers).length === 8;
    return true;
  };

  const gateMsg = () => {
    if (step === 1) return "Enter your name and field of study";
    if (step === 2) return "Select at least 1 activity and 1 motivator";
    if (step === 4) return "Select at least one skill";
    if (step === 5) return "Select your target role";
    if (step === 6) return "Answer all 8 questions";
    return "";
  };

  const stepContent = [
    <IdentityModule key="id" data={identity} onChange={setIdentity} />,
    <InterestsModule key="int" data={interests} onChange={setInterests} />,
    <ExperienceModule key="exp" data={experience} onChange={setExperience} />,
    <SkillsModule
      key="sk"
      data={skills}
      onChange={setSkills}
      fieldOfStudy={identity.field_of_study}
    />,
    <IntentModule key="int2" data={intent} onChange={setIntent} />,
    <PersonalityModule
      key="per"
      data={personality}
      onChange={setPersonality}
    />,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* ─── HERO ──────────────────────────────────────────────────── */}
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6"
            >
              <div className="dot-grid-bg pointer-events-none absolute inset-0" />
              <div className="relative z-10 max-w-2xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Universal Career Intelligence — v2
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
                >
                  Your career,
                  <br />
                  <span className="text-primary">intelligently mapped.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 text-base text-muted-foreground sm:text-lg max-w-lg mx-auto"
                >
                  Works for every field — engineering, arts, medicine, law,
                  design, commerce, and more. 6-module assessment. Dual-track
                  analysis. One precise report.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex items-center justify-center gap-4"
                >
                  <button
                    onClick={() => setView("input")}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                  >
                    Begin Free Assessment
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-10 flex items-center justify-center gap-6 text-xs text-zinc-600"
                >
                  {[
                    "6 modules",
                    "Dual-track report",
                    "AI-powered roadmap",
                    "Live job data",
                  ].map((f) => (
                    <span key={f} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      {f}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── INPUT ─────────────────────────────────────────────────── */}
          {view === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-2xl px-6 py-10"
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                className="text-sm text-zinc-500 hover:text-white transition-colors mb-6 flex items-center gap-1"
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

              {/* Step circles + connector lines */}
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border transition-all ${
                        s.num < step
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : s.num === step
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-zinc-700 bg-zinc-900 text-zinc-600"
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
                    {i < STEPS.length - 1 && (
                      <div
                        className={`h-px w-6 sm:w-8 mx-1 transition-colors ${s.num < step ? "bg-emerald-500/40" : "bg-zinc-800"}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full rounded-full bg-zinc-800 mb-6">
                <motion.div
                  className="h-full rounded-full bg-blue-500"
                  animate={{
                    width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>

              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">
                Step {step} of {STEPS.length}
              </p>

              {error && (
                <div className="mb-5 rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Animated step content */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    {stepContent[step - 1]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="mt-5 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {step < 6 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Generate My Intelligence Report →
                  </button>
                )}
              </div>
              {!canProceed() && gateMsg() && (
                <p className="text-xs text-zinc-600 mt-2 text-center">
                  {gateMsg()}
                </p>
              )}
            </motion.div>
          )}

          {/* ─── LOADING ───────────────────────────────────────────────── */}
          {view === "loading" && <LoadingScreen key="loading" />}

          {/* ─── RESULTS ───────────────────────────────────────────────── */}
          {view === "results" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl px-6 py-10"
            >
              {/* ── Report Header ── */}
              <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">
                      ALIGNIQ Intelligence Report ·{" "}
                      {results.identity.generated_date}
                    </p>
                    <h1 className="text-3xl font-bold text-white">
                      {results.identity.name}
                    </h1>
                    <p className="text-zinc-500 text-xs mt-1 font-mono">
                      {results.identity.profile_id}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        Best fit: {results.best_fit.role}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        Goal: {results.chosen_career.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    New Assessment
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {/* Section 1 — Interest Profile */}
                <InterestProfileCard data={results.interest_profile} />

                {/* Divider */}
                <div className="border-t border-zinc-800" />

                {/* Section 2 — Best Fit */}
                <BestFitCareerCard data={results.best_fit} />

                <div className="border-t border-zinc-800" />

                {/* Section 3 — Chosen Career */}
                <ChosenCareerCard data={results.chosen_career} />

                <div className="border-t border-zinc-800" />

                {/* Section 4 — CRI */}
                <CRIScore data={results.cri} />

                <div className="border-t border-zinc-800" />

                {/* Section 5 — Jobs */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    Live Opportunities
                  </h2>
                  <p className="text-zinc-500 text-sm">
                    Active listings closest to your target role and location.
                  </p>
                  <JobOpportunities jobs={results.jobs} />
                </div>

                <div className="border-t border-zinc-800" />

                {/* Section 6 — Executive Summary */}
                <ExecutiveSummary
                  summary={results.executive_summary}
                  name={results.identity.name}
                />

                <div className="border-t border-zinc-800" />

                {/* Section 7 — Action Checklist */}
                <ActionChecklist items={results.action_checklist} />

                {/* Footer */}
                <div className="pt-4 text-center">
                  <p className="text-xs text-zinc-700">
                    Generated by ALIGNIQ · {results.identity.profile_id} ·{" "}
                    {results.identity.generated_date}
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
                  >
                    Start a new assessment
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
