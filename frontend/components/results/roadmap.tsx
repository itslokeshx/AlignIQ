"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { RoadmapPhase } from "@/lib/types";

interface Props {
  roadmap: {
    phase_1: RoadmapPhase;
    phase_2: RoadmapPhase;
    phase_3: RoadmapPhase;
  };
  actionChecklist: string[];
  targetRole: string;
}

const PHASE_ACCENTS = [
  {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    numColor: "text-blue-400",
    dotColor: "bg-blue-500",
    barColor: "from-blue-500 to-blue-400",
    iconBg: "bg-blue-500/15",
  },
  {
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    numColor: "text-violet-400",
    dotColor: "bg-violet-500",
    barColor: "from-violet-500 to-violet-400",
    iconBg: "bg-violet-500/15",
  },
  {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    numColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    barColor: "from-emerald-500 to-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
];

export default function Roadmap({
  roadmap,
  actionChecklist,
  targetRole,
}: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const phases = [roadmap?.phase_1, roadmap?.phase_2, roadmap?.phase_3].filter(
    Boolean,
  );

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const done = checked.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">
            Your Personalised Roadmap
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-blue-300 border border-blue-500/20">
            {targetRole}
          </span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          Step-by-step plan to bridge your skill gaps and reach career
          readiness.
        </p>
      </div>

      {/* Timeline phases */}
      {phases.length > 0 && (
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/40 via-violet-500/40 to-emerald-500/40" />

          <div className="space-y-4">
            {phases.map(
              (phase, i) =>
                phase && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className={`relative rounded-xl border ${PHASE_ACCENTS[i].border} ${PHASE_ACCENTS[i].bg} p-5 ml-10`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[2.85rem] top-5 w-3 h-3 rounded-full ${PHASE_ACCENTS[i].dotColor} ring-4 ring-zinc-950`}
                    />

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${PHASE_ACCENTS[i].numColor}`}
                        >
                          Phase {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {phase.title}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        {phase.duration}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {phase.actions.map((a, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm text-zinc-400"
                        >
                          <div
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${PHASE_ACCENTS[i].dotColor} opacity-60`}
                          />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ),
            )}
          </div>
        </div>
      )}

      {/* Action Checklist */}
      {actionChecklist && actionChecklist.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-blue-400"
              >
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 8L7 10L11 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Action Checklist
            </h3>
            <span className="text-xs text-zinc-600 tabular-nums font-mono">
              {done}/{actionChecklist.length} complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500"
              animate={{
                width: actionChecklist.length
                  ? `${(done / actionChecklist.length) * 100}%`
                  : "0%",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden divide-y divide-zinc-800/60">
            {actionChecklist.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`w-full flex items-start gap-3.5 px-4 py-3.5 text-left transition-all duration-200 hover:bg-zinc-800/30 ${
                  checked.has(i) ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`mt-0.5 w-4.5 h-4.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${
                    checked.has(i)
                      ? "border-emerald-500 bg-emerald-500 scale-95"
                      : "border-zinc-600 hover:border-zinc-400"
                  }`}
                  style={{ width: 18, height: 18 }}
                >
                  {checked.has(i) && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm leading-relaxed transition-all duration-200 ${
                    checked.has(i)
                      ? "line-through text-zinc-600"
                      : "text-zinc-300"
                  }`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>

          {done === actionChecklist.length && actionChecklist.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3 text-sm text-emerald-400 font-medium"
            >
              🎉 All tasks complete — you&apos;re ready to launch!
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
