"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CRIResult } from "@/lib/types";

interface Props {
  data: CRIResult;
}

export function GapRadarChart({ data }: Props) {
  // Industry benchmarks (target values for a competitive candidate)
  const benchmarks = {
    Skills: 75,
    Experience: 70,
    Academics: 72,
    "Market Fit": 65,
  };

  const chartData = [
    {
      axis: "Skills",
      student: Math.round(data.skill_depth_index),
      benchmark: benchmarks.Skills,
    },
    {
      axis: "Experience",
      student: Math.round(data.experience_adequacy_index),
      benchmark: benchmarks.Experience,
    },
    {
      axis: "Academics",
      student: Math.round(data.academic_reliability_index),
      benchmark: benchmarks.Academics,
    },
    {
      axis: "Market Fit",
      student: Math.round(data.market_alignment_score),
      benchmark: benchmarks["Market Fit"],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Gap Analysis
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#1E1E1E" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#A0A0A0", fontSize: 12, fontFamily: "Inter" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#606060", fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Your Profile"
            dataKey="student"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Industry Benchmark"
            dataKey="benchmark"
            stroke="#FFFFFF"
            fill="transparent"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontFamily: "Inter",
              color: "#A0A0A0",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
