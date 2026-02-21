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
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        High-Alignment Opportunities
      </h3>

      <div className="space-y-3">
        {jobs.map((job, i) => {
          const matchColor =
            job.match_percentage >= 60
              ? "bg-success/10 text-success"
              : job.match_percentage >= 30
                ? "bg-warning/10 text-warning"
                : "bg-destructive/10 text-destructive";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-4 transition-colors hover:border-border hover:bg-secondary/40"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {job.title}
                  </h4>
                  <span
                    className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${matchColor}`}
                  >
                    {job.match_percentage}% match
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{job.company}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span>{job.location}</span>
                  {job.salary && job.salary !== "Not disclosed" && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span className="font-mono">
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
                className="ml-4 shrink-0 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80 hover:border-primary/30"
              >
                Apply →
              </a>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
