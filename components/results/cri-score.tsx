"use client";

import { motion } from "framer-motion";
import type { CRIResult } from "@/lib/types";

interface Props {
  data: CRIResult;
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={stroke}
        />
        {/* Score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-bold font-mono text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function SubIndex({ label, score }: { label: string; score: number }) {
  const color =
    score >= 70 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono font-semibold text-foreground">
          {score}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export function CRIScore({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Career Readiness Index
      </h3>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <ScoreGauge score={Math.round(data.cri_total)} />

        <div className="flex-1 space-y-4 w-full">
          <SubIndex
            label="Academic Reliability"
            score={Math.round(data.academic_reliability_index)}
          />
          <SubIndex
            label="Skill Depth"
            score={Math.round(data.skill_depth_index)}
          />
          <SubIndex
            label="Experience Adequacy"
            score={Math.round(data.experience_adequacy_index)}
          />
          <SubIndex
            label="Market Alignment"
            score={Math.round(data.market_alignment_score)}
          />
        </div>
      </div>
    </motion.div>
  );
}
