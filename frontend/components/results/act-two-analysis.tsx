"use client";

import { motion } from "framer-motion";
import type {
  BestFitCareer,
  ChosenCareerAnalysis,
  CRIResult,
} from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  bestFit: BestFitCareer;
  chosen: ChosenCareerAnalysis;
  cri: CRIResult;
  bridgeSentence: string;
}

/* ─── CRI Sub-indices ────────────────────────────────────────────────────── */
const SUB = [
  {
    key: "academic_reliability_index" as const,
    label: "Academic",
    max: 25,
    color: "#3b82f6",
    gradient: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  {
    key: "skill_depth_index" as const,
    label: "Skills",
    max: 30,
    color: "#8b5cf6",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    text: "text-violet-400",
  },
  {
    key: "experience_adequacy_index" as const,
    label: "Experience",
    max: 30,
    color: "#10b981",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  {
    key: "market_alignment_score" as const,
    label: "Market",
    max: 15,
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
];

function CRIRing({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  const getColor = () => {
    if (pct >= 70)
      return {
        stroke: "#10b981",
        glow: "drop-shadow(0 0 8px rgba(16,185,129,0.3))",
      };
    if (pct >= 45)
      return {
        stroke: "#f59e0b",
        glow: "drop-shadow(0 0 8px rgba(245,158,11,0.3))",
      };
    return {
      stroke: "#ef4444",
      glow: "drop-shadow(0 0 8px rgba(239,68,68,0.3))",
    };
  };

  const { stroke, glow } = getColor();

  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90"
        style={{ filter: glow }}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="6"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl sm:text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {value}
        </motion.span>
        <span className="text-[10px] text-zinc-500 -mt-0.5">/ {max}</span>
      </div>
    </div>
  );
}

export default function ActTwoAnalysis({
  bestFit,
  chosen,
  cri,
  bridgeSentence,
}: Props) {
  const marketChartData = (chosen.market_data?.top_skills || [])
    .slice(0, 5)
    .map(([skill, count]) => {
      const maxCount = Math.max(
        ...(chosen.market_data?.top_skills || []).map(([, c]) => c),
        1,
      );
      return { skill, count, pct: Math.round((count / maxCount) * 100) };
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-emerald-500/10">
          <span className="text-sm">📊</span>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">
            Act II
          </p>
          <p className="text-sm font-medium text-zinc-300">
            Your Career Analysis
          </p>
        </div>
      </div>

      {/* ═══ Two Career Tracks ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Best Fit */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 bg-emerald-600/[0.06] rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                Best Fit
              </p>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {bestFit.role}
            </h3>
            <p className="text-3xl sm:text-[40px] font-black text-emerald-400/90 leading-none mb-3 sm:mb-4">
              {bestFit.score}
              <span className="text-base sm:text-lg font-medium text-emerald-400/40">
                %
              </span>
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {[
                { label: "Salary", value: bestFit.salary_range },
                { label: "Growth", value: bestFit.growth_trajectory },
                { label: "Demand", value: bestFit.market_demand },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between text-xs sm:text-sm"
                >
                  <span className="text-zinc-500">{r.label}</span>
                  <span className="text-zinc-300 font-medium truncate ml-2 text-right">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            {bestFit.why}
          </p>
        </div>

        {/* Chosen Goal */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.04] to-transparent p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 bg-blue-600/[0.06] rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-400">
                Your Goal
              </p>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{chosen.role}</h3>
            <p className="text-3xl sm:text-[40px] font-black text-blue-400/90 leading-none mb-3 sm:mb-4">
              {chosen.alignment_score}
              <span className="text-base sm:text-lg font-medium text-blue-400/40">
                %
              </span>
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {[
                {
                  label: "Salary",
                  value: chosen.market_data?.entry_salary || "N/A",
                },
                {
                  label: "Entry Exp",
                  value: chosen.market_data?.avg_experience || "0–2 yrs",
                },
                { label: "Gap", value: chosen.gap_severity },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between text-xs sm:text-sm"
                >
                  <span className="text-zinc-500">{r.label}</span>
                  <span className="text-zinc-300 font-medium truncate ml-2 text-right">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            {chosen.role_description
              ? chosen.role_description.split(".").slice(0, 2).join(".") + "."
              : ""}
          </p>
        </div>
      </div>

      {/* Bridge sentence */}
      {bridgeSentence && (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2">
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
          <p className="text-[11px] sm:text-[12px] text-zinc-500 italic text-center leading-relaxed max-w-md">
            &ldquo;{bridgeSentence}&rdquo;
          </p>
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
        </div>
      )}

      {/* ═══ Alignment match bars ══════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {[
          {
            label: "Interest",
            val: chosen.interest_match,
            color: "from-violet-500 to-purple-600",
            bg: "bg-violet-500/10",
            border: "border-violet-500/20",
          },
          {
            label: "Skill",
            val: chosen.skill_match,
            color: "from-blue-500 to-cyan-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
          },
          {
            label: "Experience",
            val: chosen.experience_match,
            color: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`relative overflow-hidden rounded-xl border ${m.border} ${m.bg} py-3 px-2 sm:py-4 sm:px-3 text-center`}
          >
            <p className="text-xl sm:text-3xl font-bold text-white">
              {m.val}
              <span className="text-[10px] sm:text-sm font-normal text-zinc-600">
                %
              </span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">
              {m.label}
            </p>
            {/* Bottom fill indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <motion.div
                className={`h-full bg-gradient-to-r ${m.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${m.val}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ═══ CRI Score — Ring + Sub-indices ═══════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-4 sm:p-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/[0.03] rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-4 sm:mb-6 text-center">
            Career Readiness Index
          </p>

          <CRIRing value={cri.cri_total} max={100} />

          {/* Sub-index grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {SUB.map((s) => {
              const val = cri[s.key];
              const pct = Math.round((val / s.max) * 100);
              return (
                <div
                  key={s.key}
                  className={`rounded-xl border ${s.border} bg-gradient-to-br ${s.gradient} p-2.5 sm:p-3.5`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {s.label}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${s.text}`}
                    >
                      {val.toFixed(1)}
                      <span className="text-zinc-600 font-normal text-[10px]">
                        /{s.max}
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800/80">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Projected CRI */}
          <div className="mt-5 pt-4 border-t border-zinc-800/40 text-center">
            <p className="text-xs text-zinc-600">
              After roadmap completion →{" "}
              <span className="text-emerald-400 font-bold text-sm">
                {cri.projected_cri}
              </span>
              <span className="text-zinc-700 text-[10px]"> / 100</span>
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Market Demand Chart ═══════════════════════════════════════ */}
      {marketChartData.length > 0 && (
        <div className="rounded-2xl border border-white/[0.04] bg-zinc-900/50 p-3.5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3 sm:mb-5">
            Market demand for{" "}
            <span className="text-zinc-300">{chosen.role}</span>
          </p>
          <ResponsiveContainer
            width="100%"
            height={marketChartData.length * 36 + 10}
          >
            <BarChart
              data={marketChartData}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="skill"
                width={75}
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {marketChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0
                        ? "#3b82f6"
                        : `rgba(99,102,241,${0.85 - i * 0.12})`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ═══ Skill Pills ═══════════════════════════════════════════════ */}
      <div className="space-y-3">
        {chosen.you_have.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-500/70 mb-2">
              Skills you have
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chosen.you_have.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {chosen.missing_skills.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-500/70 mb-2">
              Skills to build
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chosen.missing_skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium"
                >
                  + {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
