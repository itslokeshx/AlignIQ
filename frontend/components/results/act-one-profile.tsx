"use client";

import { motion } from "framer-motion";
import type { PersonalityScores } from "@/lib/types";

interface Props {
  summary: string;
  personality: PersonalityScores;
}

const DIMENSIONS = [
  { key: "analytical_creative" as const, label: "Analytical" },
  { key: "independent_collaborative" as const, label: "Independent" },
  { key: "theoretical_practical" as const, label: "Practical" },
  { key: "stable_adaptive" as const, label: "Adaptive" },
  { key: "specialist_generalist" as const, label: "Specialist" },
];

export default function ActOneProfile({ summary, personality }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Act label */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
          Who You Are
        </p>
      </div>

      {/* AI prose — one card, clean, personal */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-6 sm:px-8 py-7">
        <p className="text-[15px] text-zinc-300 leading-[1.8] font-light">
          {summary}
        </p>
      </div>

      {/* Compact horizontal personality bars */}
      <div className="space-y-3.5">
        {DIMENSIONS.map((dim) => {
          // For each dimension, figure out the filled value
          // Lower value = more left trait, higher = more right trait
          const raw = personality[dim.key];
          // We show the dominant side's percentage
          const val = dim.key === "theoretical_practical" ? raw : 100 - raw;
          const displayVal = Math.max(val, 100 - val);

          return (
            <div key={dim.key} className="flex items-center gap-4">
              <span className="text-xs text-zinc-500 w-20 shrink-0 text-right">
                {dim.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600/80 to-violet-600/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayVal}%` }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
