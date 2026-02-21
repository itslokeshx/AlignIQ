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
    color: "bg-blue-500",
  },
  {
    key: "skill_depth_index" as const,
    label: "Skills",
    max: 30,
    color: "bg-violet-500",
  },
  {
    key: "experience_adequacy_index" as const,
    label: "Experience",
    max: 30,
    color: "bg-emerald-500",
  },
  {
    key: "market_alignment_score" as const,
    label: "Market",
    max: 15,
    color: "bg-yellow-500",
  },
];

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
      className="space-y-10"
    >
      {/* Act label */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
        Your Career Analysis
      </p>

      {/* ═══ 2a. Two Tracks Side By Side ═══════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Best Fit card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 sm:p-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
            Best Fit
          </p>
          <h3 className="text-lg font-semibold text-white">{bestFit.role}</h3>
          <div className="space-y-2.5">
            {[
              { label: "Fit Score", value: `${bestFit.score}%` },
              { label: "Salary", value: bestFit.salary_range },
              { label: "Growth", value: bestFit.growth_trajectory },
              { label: "Market", value: bestFit.market_demand },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-zinc-500">{r.label}</span>
                <span className="text-zinc-200 font-medium">{r.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-zinc-500 leading-relaxed pt-1">
            {bestFit.why}
          </p>
        </div>

        {/* Chosen Goal card */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-5 sm:p-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-400">
            Your Goal
          </p>
          <h3 className="text-lg font-semibold text-white">{chosen.role}</h3>
          <div className="space-y-2.5">
            {[
              { label: "Alignment", value: `${chosen.alignment_score}%` },
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
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-zinc-500">{r.label}</span>
                <span className="text-zinc-200 font-medium">{r.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-zinc-500 leading-relaxed pt-1">
            {chosen.role_description
              ? chosen.role_description.split(".").slice(0, 2).join(".") + "."
              : ""}
          </p>
        </div>
      </div>

      {/* Bridge sentence */}
      {bridgeSentence && (
        <p className="text-[13px] text-zinc-400 italic text-center px-4 leading-relaxed">
          &ldquo;{bridgeSentence}&rdquo;
        </p>
      )}

      {/* ═══ 2b. CRI Score — One Clean Block ══════════════════════════ */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600 mb-5">
          Career Readiness Index
        </p>
        <div className="text-center mb-6">
          <span className="text-[40px] font-bold text-white leading-none">
            {cri.cri_total}
          </span>
          <span className="text-zinc-600 text-lg font-light ml-1">/ 100</span>
        </div>

        {/* 2×2 sub-score grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {SUB.map((s) => {
            const val = cri[s.key];
            const pct = Math.round((val / s.max) * 100);
            return (
              <div key={s.key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="text-zinc-300 font-medium tabular-nums">
                    {val.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-zinc-600 text-center">
          After roadmap completion →{" "}
          <span className="text-emerald-400 font-semibold">
            {cri.projected_cri}
          </span>
          <span className="text-zinc-700"> / 100</span>
        </p>
      </div>

      {/* ═══ 2c. Alignment Visual ═════════════════════════════════════ */}
      <div className="space-y-6">
        {/* Three-number alignment row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Interest Match", val: chosen.interest_match },
            { label: "Skill Match", val: chosen.skill_match },
            { label: "Experience Match", val: chosen.experience_match },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 py-4 px-3"
            >
              <p className="text-2xl font-bold text-white">{m.val}%</p>
              <p className="text-[11px] text-zinc-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Market demand bars for chosen role — top 5 */}
        {marketChartData.length > 0 && (
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
            <p className="text-xs text-zinc-500 mb-5">
              Market demands for{" "}
              <span className="text-zinc-300">{chosen.role}</span> right now
            </p>
            <ResponsiveContainer
              width="100%"
              height={marketChartData.length * 32 + 10}
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
                  width={95}
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#a1a1aa" }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {marketChartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === 0
                          ? "#3b82f6"
                          : `rgba(99,102,241,${0.8 - i * 0.12})`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Skill pills — you have / to build */}
        <div className="space-y-4">
          {chosen.you_have.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-600 mr-1">You have:</span>
              {chosen.you_have.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          {chosen.missing_skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-600 mr-1">To build:</span>
              {chosen.missing_skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
