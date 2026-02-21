"use client";
import { BestFitCareer } from "@/lib/types";

interface Props {
  data: BestFitCareer;
}

const DEMAND_COLORS: Record<string, string> = {
  "Very Strong": "text-emerald-400",
  "Always High": "text-emerald-400",
  Strong: "text-blue-400",
  Growing: "text-blue-400",
  Moderate: "text-yellow-400",
  Stable: "text-yellow-400",
  Changing: "text-orange-400",
  Niche: "text-zinc-400",
  Variable: "text-zinc-400",
};

export default function BestFitCareerCard({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">Best Fit — Track A</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Statistically optimal
        </span>
      </div>
      <p className="text-zinc-500 text-sm">
        Your highest-scoring match across personality, education, and interests.
      </p>

      {/* Primary Card */}
      <div className="rounded-2xl border border-zinc-700/70 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 space-y-5">
        {/* Role + score */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-white">{data.role}</h3>
            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-xl">
              {data.why}
            </p>
          </div>
          <div className="flex-shrink-0 sm:text-right">
            <div className="text-3xl font-bold text-emerald-400">
              {data.score}%
            </div>
            <div className="text-xs text-zinc-600 mt-0.5">match score</div>
          </div>
        </div>

        {/* Market stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Salary Range", value: data.salary_range, icon: "₹" },
            { label: "Growth", value: data.growth_trajectory, icon: "↑" },
            { label: "Market", value: data.market_demand, icon: "◆" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3"
            >
              <div className="text-xs text-zinc-600 mb-1">{s.label}</div>
              <div
                className={`text-sm font-semibold ${DEMAND_COLORS[s.value] || "text-zinc-300"}`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        {data.strengths.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
              What you already have
            </p>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills to develop */}
        {data.skills_to_develop.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
              To build
            </p>
            <div className="flex flex-wrap gap-2">
              {data.skills_to_develop.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs"
                >
                  + {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Secondary fits */}
      {(data.second_fit?.role || data.third_fit?.role) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[data.second_fit, data.third_fit]
            .filter((f) => f?.role)
            .map((fit, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">#{i + 2} fit</span>
                  <span className="text-sm font-bold text-zinc-300">
                    {fit!.score}%
                  </span>
                </div>
                <p className="text-sm font-medium text-white mt-1.5">
                  {fit!.role}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
