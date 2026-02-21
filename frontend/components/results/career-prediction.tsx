"use client";

import { motion } from "framer-motion";
import type { MLPrediction } from "@/lib/types";

interface Props {
  data: MLPrediction;
}

export function CareerPrediction({ data }: Props) {
  const predictions = data.top_3_predictions;
  const importanceEntries = Object.entries(data.feature_importance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const formatLabel = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/norm/g, "")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Career Prediction
      </h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.role}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`rounded-lg border p-4 ${
              i === 0
                ? "border-primary/30 bg-primary/5 md:row-span-2"
                : "border-border bg-secondary/30"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-sm font-mono font-semibold ${
                  i === 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {(pred.probability * 100).toFixed(0)}%
              </span>
            </div>

            <h4
              className={`font-semibold ${i === 0 ? "text-lg text-foreground" : "text-sm text-foreground"}`}
            >
              {pred.role}
            </h4>

            {i === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Highest confidence match based on your profile
              </p>
            )}

            {/* Feature importance only on primary card */}
            {i === 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Driving Factors
                </p>
                {importanceEntries.map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatLabel(key)}
                      </span>
                      <span className="text-xs font-mono text-foreground">
                        {(val * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-primary/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${val * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
