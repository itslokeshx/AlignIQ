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
    icon: "🧠",
    colorFrom: "from-blue-500",
    colorTo: "to-violet-500",
    bg: "bg-blue-500",
  },
  {
    key: "independent_collaborative" as const,
    left: "Independent",
    right: "Collaborative",
    icon: "🤝",
    colorFrom: "from-violet-500",
    colorTo: "to-pink-500",
    bg: "bg-violet-500",
  },
  {
    key: "theoretical_practical" as const,
    left: "Theoretical",
    right: "Practical",
    icon: "🔬",
    colorFrom: "from-emerald-500",
    colorTo: "to-teal-500",
    bg: "bg-emerald-500",
  },
  {
    key: "stable_adaptive" as const,
    left: "Stable",
    right: "Adaptive",
    icon: "⚡",
    colorFrom: "from-amber-500",
    colorTo: "to-orange-500",
    bg: "bg-amber-500",
  },
  {
    key: "specialist_generalist" as const,
    left: "Specialist",
    right: "Generalist",
    icon: "🎯",
    colorFrom: "from-rose-500",
    colorTo: "to-pink-500",
    bg: "bg-rose-500",
  },
];

export default function ActOneProfile({ summary, personality }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
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
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 p-5 sm:p-7">
        <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/[0.04] rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Intelligence Summary
          </p>
          <p className="text-[14px] sm:text-[15px] text-zinc-300 leading-[1.85] font-light">
            {summary}
          </p>
        </div>
      </div>

      {/* Personality Dimensions — visual spectrum bars */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">
          Personality Spectrum
        </p>

        <div className="grid gap-3">
          {DIMENSIONS.map((dim, idx) => {
            const val = personality[dim.key];

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className="rounded-xl border border-white/[0.04] bg-zinc-900/50 hover:bg-zinc-900/70 transition-all p-3 sm:p-4">
                  {/* Row: icon + labels + value */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-base shrink-0">{dim.icon}</span>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-xs text-zinc-500 truncate">
                        {dim.left}
                      </span>
                      <span className="text-xs text-zinc-500 truncate">
                        {dim.right}
                      </span>
                    </div>
                  </div>

                  {/* Spectrum bar */}
                  <div className="relative h-2 rounded-full bg-zinc-800/80 overflow-hidden ml-8 sm:ml-9">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-600/40 z-10" />

                    <motion.div
                      className={`absolute top-0 h-full rounded-full bg-gradient-to-r ${dim.colorFrom} ${dim.colorTo} opacity-80`}
                      initial={{ width: 0 }}
                      animate={{
                        left: val < 50 ? `${val}%` : "50%",
                        width: `${Math.abs(val - 50)}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + idx * 0.08,
                        ease: "easeOut",
                      }}
                    />

                    <motion.div
                      className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${dim.bg} ring-2 ring-zinc-900 z-20`}
                      initial={{ left: "50%" }}
                      animate={{ left: `calc(${val}% - 6px)` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + idx * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
