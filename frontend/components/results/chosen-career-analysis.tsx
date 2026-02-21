"use client";
import { ChosenCareerAnalysis } from "@/lib/types";
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
  data: ChosenCareerAnalysis;
}

const PHASE_COLORS = [
  "border-blue-500/40 bg-blue-500/5",
  "border-violet-500/40 bg-violet-500/5",
  "border-emerald-500/40 bg-emerald-500/5",
];
const PHASE_NUM_COLORS = [
  "text-blue-400",
  "text-violet-400",
  "text-emerald-400",
];

const GAP_COLORS: Record<string, string> = {
  Minimal: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Minor: "text-yellow-400  bg-yellow-500/10  border-yellow-500/30",
  Moderate: "text-orange-400  bg-orange-500/10  border-orange-500/30",
  Significant: "text-red-400     bg-red-500/10     border-red-500/30",
};

function AlignmentVenn({
  interest,
  skill,
  experience,
  overall,
}: {
  interest: number;
  skill: number;
  experience: number;
  overall: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-zinc-300">
          Alignment Breakdown
        </h4>
        <span className="text-2xl font-bold text-white">{overall}%</span>
      </div>
      <div className="space-y-3">
        {[
          { label: "Interest match", val: interest, color: "bg-blue-500" },
          { label: "Skill match", val: skill, color: "bg-violet-500" },
          {
            label: "Experience match",
            val: experience,
            color: "bg-emerald-500",
          },
        ].map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">{m.label}</span>
              <span className="text-zinc-200 font-medium">{m.val}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full ${m.color} transition-all duration-700`}
                style={{ width: `${m.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChosenCareerCard({ data }: Props) {
  const roadmapPhases = [
    data.roadmap?.phase_1,
    data.roadmap?.phase_2,
    data.roadmap?.phase_3,
  ].filter(Boolean);
  const marketChartData = (data.market_data?.top_skills || [])
    .slice(0, 7)
    .map(([skill, count]) => ({ skill, count }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">
          Chosen Career — Track B
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Your stated goal
        </span>
      </div>

      {/* Role title + description */}
      <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/50 p-6 space-y-3">
        <h3 className="text-2xl font-bold text-white">{data.role}</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 mb-1">Salary range</div>
            <div className="font-medium text-zinc-200">
              {data.market_data?.entry_salary || "N/A"}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 mb-1">Avg exp required</div>
            <div className="font-medium text-zinc-200">
              {data.market_data?.avg_experience || "0–2 yrs"}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 mb-1">Gap severity</div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full border inline-block ${GAP_COLORS[data.gap_severity] || "text-zinc-400"}`}
            >
              {data.gap_severity}
            </div>
          </div>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {data.role_description}
        </p>
      </div>

      {/* Alignment meters */}
      <AlignmentVenn
        interest={data.interest_match}
        skill={data.skill_match}
        experience={data.experience_match}
        overall={data.alignment_score}
      />

      {/* Market skill demand */}
      {marketChartData.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h4 className="text-sm font-medium text-zinc-300 mb-4">
            Skills demanded in market listings
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={marketChartData}
              layout="vertical"
              margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="skill"
                width={130}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {marketChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0 ? "#3b82f6" : `rgba(99,102,241,${0.8 - i * 0.08})`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skills gap */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">
          Skills gap analysis
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wide">
              You have
            </p>
            <div className="space-y-1">
              {data.you_have.length > 0 ? (
                data.you_have.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 text-sm text-emerald-300"
                  >
                    <span className="text-emerald-500">✓</span> {s}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-600">None matched yet</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wide">
              To build
            </p>
            <div className="space-y-1">
              {data.missing_skills.length > 0 ? (
                data.missing_skills.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-zinc-600">○</span> {s}
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-600">
                  All key skills covered!
                </p>
              )}
            </div>
          </div>
        </div>
        {data.gap_timeline && (
          <p className="text-xs text-zinc-500 border-t border-zinc-800 pt-3">
            Gap assessment:{" "}
            <span className="text-zinc-300">{data.gap_timeline}</span>
          </p>
        )}
      </div>

      {/* Roadmap */}
      {roadmapPhases.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300">
            Your personalised roadmap
          </h4>
          <div className="space-y-3">
            {roadmapPhases.map(
              (phase, i) =>
                phase && (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${PHASE_COLORS[i]}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-bold ${PHASE_NUM_COLORS[i]}`}
                      >
                        Phase {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {phase.title}
                      </span>
                      <span className="ml-auto text-xs text-zinc-500">
                        {phase.duration}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {phase.actions.map((a, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-xs text-zinc-400"
                        >
                          <span className="text-zinc-600 mt-0.5">›</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
