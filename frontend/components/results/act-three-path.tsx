"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type {
  JobResult,
  RoadmapPhase,
  EnrichedAction,
  Resource,
} from "@/lib/types";

interface Props {
  jobs: JobResult[];
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-opacity hover:opacity-80 ${color}`}
    >
      <span>{resource.type === "practice" ? "🎯" : "📚"}</span>
      <span className="truncate max-w-[180px]">{resource.title}</span>
      <span className="opacity-40">·</span>
      <span className="opacity-50 text-[10px]">{resource.platform}</span>
      <span className="opacity-30">→</span>
    </a>
  );
}

/* ─── Phase accents ────────────────────────────────────────────────────── */
const ACCENTS = [
  { border: "border-l-blue-500/60", label: "text-blue-400" },
  { border: "border-l-violet-500/60", label: "text-violet-400" },
  { border: "border-l-emerald-500/60", label: "text-emerald-400" },
];

function getActionText(a: string | EnrichedAction): string {
  return typeof a === "string" ? a : a.action;
}

function getActionResources(a: string | EnrichedAction): Resource[] {
  return typeof a === "string" ? [] : a.resources || [];
}

export default function ActThreePathForward({
  jobs,
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-10"
    >
      {/* Act label */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
        Your Path Forward
      </p>

      {/* ═══ 3a. Live Opportunities ═══════════════════════════════════ */}
      {jobs && jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Roles available for you right now
          </h3>

          <div className="space-y-3">
            {jobs.slice(0, 5).map((job, i) => {
              const pct = Math.round(job.match_percentage);
              const pillColor =
                pct >= 70
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : pct >= 50
                    ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                    : "bg-zinc-700/30 text-zinc-400 border-zinc-700";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="group rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {job.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {pct > 0 && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${pillColor}`}
                        >
                          {pct}%
                        </span>
                      )}
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                      >
                        Apply →
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ 3b. Roadmap with Resources ═══════════════════════════════ */}
      {phases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            How to close the gap
          </h3>

          <div className="space-y-4">
            {phases.map((phase, i) =>
              phase ? (
                <div
                  key={i}
                  className={`border-l-2 ${ACCENTS[i].border} pl-5 sm:pl-6 py-1`}
                >
                  <div className="flex flex-wrap items-baseline gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${ACCENTS[i].label}`}
                    >
                      Phase {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {phase.title}
                    </span>
                    <span className="text-xs text-zinc-600 font-mono ml-auto">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phase.actions.slice(0, 3).map((a, j) => (
                      <div key={j}>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          → {getActionText(a)}
                        </p>
                        {getActionResources(a).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5 pl-4">
                            {getActionResources(a).map((r, k) => (
                              <ResourcePill key={k} resource={r} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* ═══ 3c. Action Checklist ═════════════════════════════════════ */}
      {actionChecklist && actionChecklist.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Your next {actionChecklist.length} moves
            </h3>
            <span className="text-xs text-zinc-600 tabular-nums font-mono">
              {done}/{actionChecklist.length}
            </span>
          </div>

          {/* Thin progress bar */}
          <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
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

          <div className="space-y-1">
            {actionChecklist.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`w-full flex items-start gap-3 px-3 py-3 text-left rounded-lg transition-all duration-200 hover:bg-zinc-900/60 ${
                  checked.has(i) ? "opacity-40" : ""
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    checked.has(i)
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-zinc-600"
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
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2 text-sm text-emerald-400 font-medium"
            >
              🎉 All tasks complete — you&apos;re ready to launch!
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}
