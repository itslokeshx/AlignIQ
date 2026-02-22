"use client";

import { motion } from "framer-motion";
import type { JobResult } from "@/lib/types";

interface Props {
  jobs: JobResult[];
  targetRole: string;
}

export default function LiveJobsSection({ jobs, targetRole }: Props) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-zinc-500">
          No live openings found for{" "}
          <span className="text-zinc-400">{targetRole}</span> right now.
        </p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Check back later — new jobs are indexed daily.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-500">
          <span className="text-zinc-300 font-semibold">{jobs.length}</span>{" "}
          openings matched for{" "}
          <span className="text-cyan-400/80 font-medium">{targetRole}</span>
        </p>
        <span className="text-[10px] text-zinc-600 bg-zinc-800/60 px-2 py-0.5 rounded-md font-mono">
          Live data
        </span>
      </div>

      {/* Job cards */}
      <div className="space-y-2">
        {jobs.slice(0, 6).map((job, i) => {
          const pct = Math.round(job.match_percentage);
          const pillColor =
            pct >= 70
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
              : pct >= 50
                ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                : "bg-zinc-700/30 text-zinc-400 border-zinc-700/40";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="group rounded-xl border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-white/[0.08] p-3 sm:p-4 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {job.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {pct > 0 && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${pillColor}`}
                    >
                      {pct}% match
                    </span>
                  )}
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
  );
}
