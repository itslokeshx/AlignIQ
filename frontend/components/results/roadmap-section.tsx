"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { RoadmapPhase, EnrichedAction, Resource } from "@/lib/types";

interface Props {
  roadmap: {
    phase_1: RoadmapPhase;
    phase_2: RoadmapPhase;
    phase_3: RoadmapPhase;
  };
  actionChecklist: string[];
  targetRole: string;
}

/* ─── Platform color map for resource pills ────────────────────────────── */
const PLATFORM_COLORS: Record<string, string> = {
  Coursera: "bg-indigo-900/50 text-indigo-300 border-indigo-800/60",
  YouTube: "bg-red-900/40 text-red-300 border-red-900/60",
  Kaggle: "bg-emerald-900/40 text-emerald-300 border-emerald-900/60",
  LeetCode: "bg-yellow-900/40 text-yellow-300 border-yellow-900/60",
  freeCodeCamp: "bg-orange-900/40 text-orange-300 border-orange-900/60",
  Practice: "bg-emerald-900/40 text-emerald-300 border-emerald-900/60",
  Udemy: "bg-purple-900/40 text-purple-300 border-purple-800/60",
  Skillshare: "bg-teal-900/40 text-teal-300 border-teal-800/60",
  "LinkedIn Learning": "bg-blue-900/40 text-blue-300 border-blue-800/60",
  edX: "bg-rose-900/40 text-rose-300 border-rose-800/60",
  "Khan Academy": "bg-green-900/40 text-green-300 border-green-800/60",
};

function ResourcePill({ resource }: { resource: Resource }) {
  const base = Object.keys(PLATFORM_COLORS).find((p) =>
    resource.platform.toLowerCase().includes(p.toLowerCase()),
  );
  const color =
    PLATFORM_COLORS[base || ""] ||
    "bg-zinc-800/60 text-zinc-300 border-zinc-700/60";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all hover:opacity-80 hover:scale-[1.02] ${color}`}
    >
      <span>{resource.type === "practice" ? "🎯" : "📚"}</span>
      <span className="truncate max-w-[140px] sm:max-w-[180px]">
        {resource.title}
      </span>
      <span className="opacity-40">·</span>
      <span className="opacity-50 text-[10px]">{resource.platform}</span>
      <span className="opacity-30">→</span>
    </a>
  );
}

/* ─── Phase accents ────────────────────────────────────────────────────── */
const PHASE_STYLES = [
  {
    border: "border-l-blue-500/60",
    label: "text-blue-400",
    bg: "from-blue-500/[0.04]",
    dot: "bg-blue-500",
    num: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    ring: "ring-blue-500/20",
  },
  {
    border: "border-l-violet-500/60",
    label: "text-violet-400",
    bg: "from-violet-500/[0.04]",
    dot: "bg-violet-500",
    num: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    ring: "ring-violet-500/20",
  },
  {
    border: "border-l-emerald-500/60",
    label: "text-emerald-400",
    bg: "from-emerald-500/[0.04]",
    dot: "bg-emerald-500",
    num: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    ring: "ring-emerald-500/20",
  },
];

function getActionText(a: string | EnrichedAction): string {
  return typeof a === "string" ? a : a.action;
}

function getActionResources(a: string | EnrichedAction): Resource[] {
  return typeof a === "string" ? [] : a.resources || [];
}

export default function RoadmapSection({
  roadmap,
  actionChecklist,
  targetRole,
}: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const done = checked.size;
  const phases = [roadmap?.phase_1, roadmap?.phase_2, roadmap?.phase_3].filter(
    Boolean,
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ═══ Phased Roadmap ═══════════════════════════════════════════ */}
      {phases.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Your path to {targetRole}
            </p>
            <span className="text-[10px] text-zinc-600 bg-zinc-800/60 px-2 py-0.5 rounded-md font-mono">
              {phases.length} phases
            </span>
          </div>

          {/* Timeline connector */}
          <div className="relative">
            {/* Vertical line behind phases */}
            <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/30 via-violet-500/20 to-emerald-500/30 hidden sm:block" />

            <div className="space-y-3">
              {phases.map((phase, i) =>
                phase ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className={`rounded-xl border border-white/[0.04] bg-gradient-to-r ${PHASE_STYLES[i].bg} to-transparent overflow-hidden`}
                  >
                    <div
                      className={`border-l-2 ${PHASE_STYLES[i].border} p-3 sm:p-5`}
                    >
                      {/* Phase header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-md border text-[10px] font-bold ${PHASE_STYLES[i].num}`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-white flex-1 min-w-0">
                          {phase.title}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono bg-zinc-800/50 px-2 py-0.5 rounded-md">
                          {phase.duration}
                        </span>
                      </div>

                      <div className="space-y-2.5 pl-4 sm:pl-8">
                        {phase.actions.slice(0, 3).map((a, j) => (
                          <div key={j}>
                            <p className="text-[12px] sm:text-[13px] text-zinc-300 leading-relaxed">
                              <span
                                className={`${PHASE_STYLES[i].label} mr-1.5`}
                              >
                                →
                              </span>
                              {getActionText(a)}
                            </p>
                            {getActionResources(a).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1 sm:ml-4">
                                {getActionResources(a).map((r, k) => (
                                  <ResourcePill key={k} resource={r} />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Action Checklist ═════════════════════════════════════════ */}
      {actionChecklist && actionChecklist.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-4 sm:p-6">
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 bg-emerald-600/[0.04] rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                Your next {actionChecklist.length} moves
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 tabular-nums font-mono">
                  {done}/{actionChecklist.length}
                </span>
                {done === actionChecklist.length &&
                  actionChecklist.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      ✓ Done
                    </span>
                  )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 rounded-full"
                animate={{
                  width: actionChecklist.length
                    ? `${(done / actionChecklist.length) * 100}%`
                    : "0%",
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <div className="space-y-0.5">
              {actionChecklist.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/[0.02] ${
                    checked.has(i) ? "opacity-35" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      checked.has(i)
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-zinc-600 hover:border-zinc-400"
                    }`}
                    style={{ width: 16, height: 16 }}
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
                    className={`text-[12px] sm:text-[13px] leading-relaxed transition-all duration-200 ${
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
                className="mt-4 pt-3 border-t border-zinc-800/40 text-center"
              >
                <p className="text-sm text-emerald-400 font-medium">
                  🎉 All complete — you&apos;re launch-ready!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
