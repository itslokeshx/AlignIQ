"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";

// ── Input modules (4 steps) ───────────────────────────────────────────────────
import AcademicModule from "@/components/input-modules/academic-module";
import ExperienceSkillsModule from "@/components/input-modules/experience-skills-module";
import CareerGoalModule from "@/components/input-modules/career-goal-module";
import PersonalityModule from "@/components/input-modules/personality-module";

// ── Result components ─────────────────────────────────────────────────────────
import ActOneProfile from "@/components/results/act-one-profile";
import ActTwoAnalysis from "@/components/results/act-two-analysis";
import ActThreePathForward from "@/components/results/act-three-path";
import { API_URL } from "@/lib/config";

import type {
  AcademicProfile,
  ExperienceSkillsProfile,
  CareerGoalProfile,
  PersonalityProfile,
  StudentProfile,
  AnalysisResponse,
} from "@/lib/types";

type ViewState = "hero" | "input" | "loading" | "results";

const STEPS = [
  { num: 1, title: "About you", desc: "Name, field & academics" },
  {
    num: 2,
    title: "Skills & experience",
    desc: "What you know & what you've done",
  },
  { num: 3, title: "Career goal", desc: "Target role & interests" },
  { num: 4, title: "Personality", desc: "8 quick questions" },
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

  // ── 4-step state ─────────────────────────────────────────────────────────
  const [academic, setAcademic] = useState<AcademicProfile>({
    name: "",
    field_of_study: "",
    cgpa: 7.5,
    consistency: "medium",
    backlogs: 0,
  });
  const [experienceSkills, setExperienceSkills] =
    useState<ExperienceSkillsProfile>({
      selected_skills: [],
      proficiency_rating: 5,
      languages_known: [],
      internships: 0,
      projects: 0,
      leadership: false,
      competitions: false,
      volunteer: false,
      earned_from_skill: false,
      readiness_rating: 5,
    });
  const [careerGoal, setCareerGoal] = useState<CareerGoalProfile>({
    target_domain: "",
    target_role: "",
    activities: [],
  });
  const [personality, setPersonality] = useState<PersonalityProfile>({
    answers: {},
  });

  const handleAnalyze = async () => {
    setError(null);
    setView("loading");
    const payload: StudentProfile = {
      academic,
      experience_skills: experienceSkills,
      career_goal: careerGoal,
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
    setAcademic({
      name: "",
      field_of_study: "",
      cgpa: 7.5,
      consistency: "medium",
      backlogs: 0,
    });
    setExperienceSkills({
      selected_skills: [],
      proficiency_rating: 5,
      languages_known: [],
      internships: 0,
      projects: 0,
      leadership: false,
      competitions: false,
      volunteer: false,
      earned_from_skill: false,
      readiness_rating: 5,
    });
    setCareerGoal({
      target_domain: "",
      target_role: "",
      activities: [],
    });
    setPersonality({ answers: {} });
  };

  const handleNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
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
    if (step === 1) return !!academic.name.trim() && !!academic.field_of_study;
    if (step === 2) return experienceSkills.selected_skills.length > 0;
    if (step === 3) return !!careerGoal.target_role;
    if (step === 4) return Object.keys(personality.answers).length === 8;
    return true;
  };

  const gateMsg = () => {
    if (step === 1) return "Enter your name and field of study";
    if (step === 2) return "Select at least one skill";
    if (step === 3) return "Select your target role";
    if (step === 4) return "Answer all 8 questions";
    return "";
  };

  const stepContent = [
    <AcademicModule key="ac" data={academic} onChange={setAcademic} />,
    <ExperienceSkillsModule
      key="es"
      data={experienceSkills}
      onChange={setExperienceSkills}
      fieldOfStudy={academic.field_of_study}
    />,
    <CareerGoalModule key="cg" data={careerGoal} onChange={setCareerGoal} />,
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
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="dot-grid-bg absolute inset-0" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(600px,120vw)] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[min(300px,80vw)] h-[300px] bg-violet-600/[0.03] rounded-full blur-[100px]" />
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
                  4-step assessment. Dual-track analysis. One precise
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
                  className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-zinc-600"
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
              className="mx-auto max-w-2xl px-4 sm:px-6 pt-3 pb-6 sm:py-8"
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
                {step < 4 ? (
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
              className="mx-auto max-w-3xl px-4 sm:px-6 pt-3 pb-6 sm:py-10"
            >
              {/* ── Premium Report Header ── */}
              <div className="mb-10 sm:mb-14">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 via-zinc-950/60 to-zinc-900/80 p-5 sm:p-8">
                  {/* Decorative orbs */}
                  <div className="pointer-events-none absolute -top-20 -left-20 w-48 h-48 bg-blue-600/[0.05] rounded-full blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 bg-violet-600/[0.04] rounded-full blur-3xl" />

                  <div className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-2">
                          Career Intelligence Report
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {results.identity.name}
                        </h1>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono bg-zinc-800/50 px-2.5 py-1 rounded-md self-start">
                        {results.identity.profile_id} ·{" "}
                        {results.identity.generated_date}
                      </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-transparent mb-5" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs text-zinc-500">
                            Best Fit:{" "}
                            <span className="text-emerald-400 font-semibold">
                              {results.best_fit.role}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs text-zinc-500">
                            Your Goal:{" "}
                            <span className="text-blue-400 font-semibold">
                              {results.chosen_career.role}
                            </span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-[11px] font-medium text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                      >
                        New Assessment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ACT 1 — Who You Are ── */}
              <ActOneProfile
                summary={results.executive_summary}
                personality={results.interest_profile.personality}
              />

              <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent my-10 sm:my-14" />

              {/* ── ACT 2 — The Analysis ── */}
              <ActTwoAnalysis
                bestFit={results.best_fit}
                chosen={results.chosen_career}
                cri={results.cri}
                bridgeSentence={results.bridge_sentence || ""}
              />

              <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent my-10 sm:my-14" />

              {/* ── ACT 3 — Your Path Forward ── */}
              <ActThreePathForward
                jobs={results.jobs}
                roadmap={results.chosen_career.roadmap}
                actionChecklist={results.action_checklist}
                targetRole={results.chosen_career.role}
              />

              {/* ── Report Footer ── */}
              <div className="mt-14 sm:mt-20 pt-6 sm:pt-8 border-t border-zinc-800/20">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50" />
                    <p className="text-[10px] text-zinc-600">
                      Powered by ML prediction · cosine alignment · live Adzuna
                      data
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={handleReset}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Start New Assessment →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
