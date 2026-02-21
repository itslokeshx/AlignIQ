"use client";

import type { CRIResult } from "@/lib/types";

interface Props {
  data: CRIResult;
}

const SUB_INDICES = [
  {
    key: "academic_reliability_index" as const,
    label: "Academic Reliability",
    max: 25,
    color: "bg-blue-500",
  },
  {
    key: "skill_depth_index" as const,
    label: "Skill Depth",
    max: 30,
    color: "bg-violet-500",
  },
  {
    key: "experience_adequacy_index" as const,
    label: "Experience Adequacy",
    max: 30,
    color: "bg-emerald-500",
  },
  {
    key: "market_alignment_score" as const,
    label: "Market Alignment",
    max: 15,
    color: "bg-yellow-500",
  },
];

function CRIGauge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 64;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const fill = arc * (pct / 100);
  const rot = 135;
  const col =
    pct >= 75
      ? "#22c55e"
      : pct >= 50
        ? "#3b82f6"
        : pct >= 30
          ? "#f59e0b"
          : "#ef4444";
  return (
    <svg viewBox="0 0 160 120" className="w-48 h-36 mx-auto">
      <circle
        cx="80"
        cy="85"
        r={r}
        fill="none"
        stroke="#27272a"
        strokeWidth="12"
        strokeDasharray={`${arc} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(${rot} 80 85)`}
      />
      <circle
        cx="80"
        cy="85"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="12"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(${rot} 80 85)`}
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text
        x="80"
        y="82"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
      >
        {value}
      </text>
      <text x="80" y="100" textAnchor="middle" fill="#71717a" fontSize="11">
        out of 100
      </text>
    </svg>
  );
}

export function CRIScore({ data }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Career Readiness Index
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          A composite score across 4 dimensions of career preparedness.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <CRIGauge value={data.cri_total} />
        <div className="text-center mt-2 mb-6">
          <span className="text-xs text-zinc-500">
            Projected CRI after next internship + skills:{" "}
          </span>
          <span className="text-emerald-400 font-semibold text-sm">
            {data.projected_cri}
          </span>
        </div>
        <div className="space-y-4">
          {SUB_INDICES.map((s) => {
            const val = data[s.key];
            const pct = Math.round((val / s.max) * 100);
            return (
              <div key={s.key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-400">{s.label}</span>
                  <span className="text-zinc-200 font-medium tabular-nums">
                    {val.toFixed(1)}{" "}
                    <span className="text-zinc-600 font-normal">/ {s.max}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
