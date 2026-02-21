"use client";

import { motion } from "framer-motion";

interface Props {
  data: {
    is_misaligned: boolean;
    passion_vs_choice_score: number;
  };
  predictedCareer: string;
  targetRole: string;
}

export function MisalignmentWarning({
  data,
  predictedCareer,
  targetRole,
}: Props) {
  if (!data.is_misaligned) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-[0_0_30px_rgba(239,68,68,0.06)]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L15 14H1L8 1Z"
              stroke="#EF4444"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M8 6V9"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11.5" r="0.75" fill="#EF4444" />
          </svg>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-destructive mb-1">
            Significant Misalignment Detected
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your stated interests and target role show a significant divergence
            ({data.passion_vs_choice_score}% alignment). Your skill and
            experience pattern suggests a different career direction.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground mb-1">ML Predicted</p>
              <p className="text-sm font-semibold text-primary">
                {predictedCareer}
              </p>
            </div>
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs text-muted-foreground mb-1">Your Choice</p>
              <p className="text-sm font-semibold text-destructive">
                {targetRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
