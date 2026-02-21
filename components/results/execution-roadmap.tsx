"use client";

import { motion } from "framer-motion";
import type { AIResult } from "@/lib/types";

interface Props {
  data: AIResult;
}

export function ExecutionRoadmap({ data }: Props) {
  const phases = [
    {
      key: "phase_1",
      phase: data.roadmap.phase_1,
      accent: "border-primary/40 bg-primary/5",
    },
    {
      key: "phase_2",
      phase: data.roadmap.phase_2,
      accent: "border-primary/25 bg-primary/3",
    },
    {
      key: "phase_3",
      phase: data.roadmap.phase_3,
      accent: "border-primary/15 bg-primary/[0.02]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Execution Roadmap
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {phases.map(({ key, phase, accent }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className={`rounded-lg border p-4 ${accent}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <h4 className="text-sm font-semibold text-foreground">
                {phase.title}
              </h4>
            </div>

            <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground mb-3">
              {phase.duration}
            </span>

            <ul className="space-y-2">
              {phase.actions.map((action, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  {action}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* CRI Improvement projection */}
      <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Projected CRI After Roadmap
          </span>
          <span className="text-sm font-mono font-semibold text-success">
            {data.projected_cri_after_roadmap}/100
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            {data.probability_increase}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-success"
              initial={{ width: "0%" }}
              animate={{ width: `${data.projected_cri_after_roadmap}%` }}
              transition={{ duration: 1.2, delay: 0.8 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
