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
import Roadmap from "@/components/results/roadmap";

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
      className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 px-6"
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
              transition={{ duration: 0.5 }}
              className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6"
            >
              {/* Background effects */}
              <div className="pointer-events-none absolute inset-0">
                <div className="dot-grid-bg absolute inset-0" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-violet-600/[0.03] rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10 max-w-2xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[11px] text-zinc-500 mb-8 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Adaptive Career Intelligence
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.5rem] leading-[1.1]"
                >
                  Your career,
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                    intelligently mapped.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-5 text-[15px] text-zinc-500 sm:text-base max-w-md mx-auto leading-relaxed"
                >
                  6-module assessment. Dual-track analysis. One precise
                  intelligence report — for every field.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 flex items-center justify-center"
                >
                  <button
                    onClick={() => setView("input")}
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Assessment
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
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
                  className="mt-12 flex items-center justify-center gap-8 text-[11px] text-zinc-600"
                >
                  {["AI-powered", "Dual-track report", "Live market data"].map(
                    (f) => (
                      <span key={f} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        {f}
                      </span>
                    ),
                  )}
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
              className="mx-auto max-w-2xl px-6 py-8"
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors mb-5 flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 3L5 8L10 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {step === 1 ? "Home" : "Back"}
              </button>

              {/* Step indicator - minimal dots */}
              <div className="flex items-center gap-1.5 mb-5">
                {STEPS.map((s) => (
                  <div
                    key={s.num}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      s.num < step
                        ? "w-6 bg-emerald-500/60"
                        : s.num === step
                          ? "w-8 bg-blue-500"
                          : "w-4 bg-zinc-800"
                    }`}
                  />
                ))}
                <span className="ml-auto text-[11px] text-zinc-600 tabular-nums">
                  {step}/{STEPS.length}
                </span>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-800/40 bg-red-900/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Animated step content */}
              <div className="rounded-2xl border border-white/[0.04] bg-zinc-950/70 p-6 backdrop-blur-sm">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -30 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {stepContent[step - 1]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="mt-4 flex gap-2.5">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all"
                  >
                    ← Back
                  </button>
                )}
                {step < 6 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={!canProceed()}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Generate Report →
                  </button>
                )}
              </div>
              {!canProceed() && gateMsg() && (
                <p className="text-[11px] text-zinc-600 mt-2 text-center">
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
              className="mx-auto max-w-3xl px-6 py-8"
            >
              {/* ── Report Header ── */}
              <div className="mb-10 rounded-2xl border border-white/[0.04] bg-zinc-950/80 p-7 relative overflow-hidden backdrop-blur-sm">
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/[0.06] rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/[0.04] rounded-full blur-[60px] pointer-events-none" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-3 font-mono">
                      Intelligence Report · {results.identity.generated_date}
                    </p>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                      {results.identity.name}
                    </h1>
                    <p className="text-zinc-700 text-[11px] mt-1 font-mono">
                      {results.identity.profile_id}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 font-medium">
                        Best fit: {results.best_fit.role}
                      </span>
                      <span className="text-[11px] px-3 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/20 text-blue-400 font-medium">
                        Goal: {results.chosen_career.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-[11px] font-medium text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                  >
                    New Assessment
                  </button>
                </div>
              </div>

              <div className="space-y-10">
                {/* Section 1 — AI Intelligence Summary (TOP) */}
                <ExecutiveSummary
                  summary={results.executive_summary}
                  name={results.identity.name}
                />

                <div className="border-t border-zinc-800/60" />

                {/* Section 2 — Interest Profile */}
                <InterestProfileCard data={results.interest_profile} />

                <div className="border-t border-zinc-800/60" />

                {/* Section 3 — Best Fit */}
                <BestFitCareerCard data={results.best_fit} />

                <div className="border-t border-zinc-800/60" />

                {/* Section 4 — Chosen Career */}
                <ChosenCareerCard data={results.chosen_career} />

                <div className="border-t border-zinc-800/60" />

                {/* Section 5 — CRI */}
                <CRIScore data={results.cri} />

                <div className="border-t border-zinc-800/60" />

                {/* Section 6 — Personalised Roadmap (combined roadmap + action checklist) */}
                <Roadmap
                  roadmap={results.chosen_career.roadmap}
                  actionChecklist={results.action_checklist}
                  targetRole={results.chosen_career.role}
                />

                <div className="border-t border-zinc-800/60" />

                {/* Section 7 — Jobs */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Live Opportunities
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">
                      Active listings closest to your target role and location.
                    </p>
                  </div>
                  <JobOpportunities jobs={results.jobs} />
                </div>

                {/* Report Footer */}
                <div className="pt-6 border-t border-white/[0.04]">
                  <div className="text-center space-y-3">
                    <p className="text-[10px] text-zinc-700 font-mono tracking-wide">
                      ALIGNIQ · {results.identity.profile_id} ·{" "}
                      {results.identity.generated_date}
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Start a new assessment →
                    </button>
                  </div>
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
