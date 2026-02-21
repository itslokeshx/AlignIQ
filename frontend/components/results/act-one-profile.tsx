"use client";

import { motion } from "framer-motion";
import type { PersonalityScores } from "@/lib/types";

interface Props {
  summary: string;
  personality: PersonalityScores;
}

const DIMENSIONS = [
  {
    key: "analytical_creative" as const,
    left: "Analytical",
    right: "Creative",
    gradient: "from-blue-500 to-violet-500",
    bg: "bg-blue-500",
    ring: "ring-blue-500/30",
    leftBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    rightBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    key: "independent_collaborative" as const,
    left: "Independent",
    right: "Collaborative",
    gradient: "from-violet-500 to-pink-500",
    bg: "bg-violet-500",
    ring: "ring-violet-500/30",
    leftBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    rightBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    key: "theoretical_practical" as const,
    left: "Theoretical",
    right: "Practical",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500",
    ring: "ring-emerald-500/30",
    leftBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rightBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  {
    key: "stable_adaptive" as const,
    left: "Stable",
    right: "Adaptive",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500",
    ring: "ring-amber-500/30",
    leftBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rightBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    key: "specialist_generalist" as const,
    left: "Specialist",
    right: "Generalist",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-500",
    ring: "ring-rose-500/30",
    leftBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    rightBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
];

function getDominantSide(val: number): "left" | "center" | "right" {
  if (val < 40) return "left";
  if (val > 60) return "right";
  return "center";
}

export default function ActOneProfile({ summary, personality }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/10">
          <span className="text-sm">👤</span>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400/80">
            Act I
          </p>
          <p className="text-sm font-medium text-zinc-300">Who You Are</p>
        </div>
      </div>

      {/* Executive Summary — premium glass card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 p-4 sm:p-7">
        <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/[0.04] rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3 sm:mb-4">
            Intelligence Summary
          </p>
          <p className="text-[13px] sm:text-[15px] text-zinc-300 leading-[1.8] sm:leading-[1.85] font-light">
            {summary}
          </p>
        </div>
      </div>

      {/* ─── Personality Spectrum — Clean Visual Layout ─────────────── */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3 sm:mb-4">
          Personality Spectrum
        </p>

        <div className="grid gap-2.5 sm:gap-3">
          {DIMENSIONS.map((dim, idx) => {
            const val = personality[dim.key];
            const side = getDominantSide(val);

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="rounded-xl border border-white/[0.04] bg-zinc-900/50 hover:bg-zinc-900/70 transition-all px-3 py-2.5 sm:px-4 sm:py-3"
              >
                {/* Labels row — dominant label is brighter */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] sm:text-xs font-medium transition-colors ${
                      side === "left" ? "text-zinc-200" : "text-zinc-600"
                    }`}
                  >
                    {dim.left}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-medium transition-colors ${
                      side === "right" ? "text-zinc-200" : "text-zinc-600"
                    }`}
                  >
                    {dim.right}
                  </span>
                </div>

                {/* Spectrum bar — full width, no margin offset */}
                <div className="relative h-2 sm:h-2.5 rounded-full bg-zinc-800/80">
                  {/* Center mark */}
                  <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-600/30 z-10" />

                  {/* Single smooth fill from 50% to val% */}
                  <motion.div
                    className={`absolute top-0 h-full bg-gradient-to-r ${dim.gradient} opacity-70`}
                    style={{
                      borderRadius: "9999px",
                    }}
                    initial={{
                      left: "50%",
                      width: "0%",
                    }}
                    animate={{
                      left: `${Math.min(val, 50)}%`,
                      width: `${Math.abs(val - 50)}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.15 + idx * 0.07,
                      ease: "easeOut",
                    }}
                  />

                  {/* Position dot — centered on val% */}
                  <motion.div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${dim.bg} ring-2 ${dim.ring} ring-offset-1 ring-offset-zinc-900 z-20`}
                    initial={{ left: "50%" }}
                    animate={{ left: `${val}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.15 + idx * 0.07,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {/* Dominant trait pill */}
                <div className="flex justify-center mt-2">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      side === "left"
                        ? dim.leftBg
                        : side === "right"
                          ? dim.rightBg
                          : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40"
                    }`}
                  >
                    {side === "left"
                      ? `← ${dim.left}`
                      : side === "right"
                        ? `${dim.right} →`
                        : "Balanced"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
