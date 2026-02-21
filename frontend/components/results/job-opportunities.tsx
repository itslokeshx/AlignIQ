"use client";

import { motion } from "framer-motion";
import type { JobResult } from "@/lib/types";

interface Props {
  jobs: JobResult[];
}

export function JobOpportunities({ jobs }: Props) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-3"
    >
      {jobs.map((job, i) => {
        // Show meaningful labels: if match is 0% from API data issues, show "Relevant" instead
        const matchPct = Math.round(job.match_percentage);
        const matchLabel =
          matchPct >= 60
            ? "High match"
            : matchPct >= 30
              ? "Good match"
              : matchPct > 0
                ? "Partial match"
                : "Relevant";
        const matchStyle =
          matchPct >= 60
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : matchPct >= 30
              ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
              : matchPct > 0
                ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                : "bg-zinc-700/30 text-zinc-400 border-zinc-700";

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
            className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-white truncate">
                  {job.title}
                </h4>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${matchStyle}`}
                >
                  {matchLabel}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">{job.company}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-700" />
                <span>{job.location}</span>
                {job.salary && job.salary !== "Not disclosed" && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="font-mono text-zinc-400">
                      ₹
                      {typeof job.salary === "number"
                        ? (job.salary / 100000).toFixed(1) + "L"
                        : job.salary}
                    </span>
                  </>
                )}
              </div>
            </div>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white group-hover:border-zinc-600"
            >
              Apply →
            </a>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
