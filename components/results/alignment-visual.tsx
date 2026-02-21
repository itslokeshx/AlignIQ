"use client";

import { motion } from "framer-motion";
import type { AlignmentResult } from "@/lib/types";

interface Props {
  data: AlignmentResult;
}

export function AlignmentVisual({ data }: Props) {
  const overlapSize = data.passion_vs_choice_score / 100;
  // Circles offset: less overlap = more separated
  const separation = 120 - overlapSize * 60;

  const isMisaligned = data.is_misaligned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`rounded-xl border bg-card p-6 ${
        isMisaligned
          ? "border-destructive/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
          : "border-border"
      }`}
    >
      <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Alignment Analysis
      </h3>

      {/* Venn diagram */}
      <div className="flex justify-center mb-6">
        <svg width="280" height="160" viewBox="0 0 280 160">
          {/* Left circle — Passion */}
          <motion.circle
            cx={140 - separation / 2}
            cy="80"
            r="55"
            fill="rgba(99,102,241,0.12)"
            stroke="#6366F1"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          {/* Right circle — Choice */}
          <motion.circle
            cx={140 + separation / 2}
            cy="80"
            r="55"
            fill="rgba(255,255,255,0.05)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          {/* Labels */}
          <text
            x={140 - separation / 2 - 20}
            y="78"
            fill="#A0A0A0"
            fontSize="11"
            fontFamily="Inter"
          >
            Your
          </text>
          <text
            x={140 - separation / 2 - 25}
            y="92"
            fill="#6366F1"
            fontSize="12"
            fontWeight="600"
            fontFamily="Inter"
          >
            Passion
          </text>
          <text
            x={140 + separation / 2 - 15}
            y="78"
            fill="#A0A0A0"
            fontSize="11"
            fontFamily="Inter"
          >
            Your
          </text>
          <text
            x={140 + separation / 2 - 20}
            y="92"
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="600"
            fontFamily="Inter"
          >
            Choice
          </text>
          {/* Overlap score */}
          <text x="130" y="145" fill="#A0A0A0" fontSize="10" fontFamily="Inter">
            {data.passion_vs_choice_score}% overlap
          </text>
        </svg>
      </div>

      {/* Score badges */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreBadge
          label="Passion Alignment"
          value={data.passion_alignment_score}
        />
        <ScoreBadge label="Role Alignment" value={data.role_alignment_score} />
        <ScoreBadge
          label="Passion vs Choice"
          value={data.passion_vs_choice_score}
          danger={isMisaligned}
        />
      </div>
    </motion.div>
  );
}

function ScoreBadge({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${danger ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/50"}`}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-lg font-mono font-bold ${danger ? "text-destructive" : "text-foreground"}`}
      >
        {value}%
      </p>
    </div>
  );
}
