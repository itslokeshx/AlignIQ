"use client";

import { motion } from "framer-motion";
import type { AIResult } from "@/lib/types";

interface Props {
  data: AIResult;
}

export function AIExecutiveSummary({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Executive Analysis
      </h3>

      <p className="text-sm leading-relaxed text-muted-foreground font-mono">
        {data.executive_summary}
      </p>

      {/* Skill prescriptions */}
      {data.skill_prescriptions && data.skill_prescriptions.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Skill Prescriptions
          </h4>
          <div className="space-y-2">
            {data.skill_prescriptions.map((rx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
              >
                <span
                  className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                    rx.priority === "High"
                      ? "bg-destructive/10 text-destructive"
                      : rx.priority === "Medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                  }`}
                >
                  {rx.priority}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rx.skill}
                  </p>
                  <p className="text-xs text-muted-foreground">{rx.why}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
