"use client";
import { InterestProfileResult } from "@/lib/types";

interface Props {
  data: InterestProfileResult;
}

const DIMENSIONS = [
  { key: "analytical_creative", left: "Analytical", right: "Creative" },
  {
    key: "independent_collaborative",
    left: "Independent",
    right: "Collaborative",
  },
  { key: "theoretical_practical", left: "Theoretical", right: "Practical" },
  { key: "stable_adaptive", left: "Stable", right: "Adaptive" },
  { key: "specialist_generalist", left: "Specialist", right: "Generalist" },
] as const;

const SIGNAL_COLORS = {
  strong: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  moderate: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  emerging: "bg-zinc-700/40 text-zinc-400 border-zinc-700",
};

const SIGNAL_DOTS = {
  strong: "bg-blue-400",
  moderate: "bg-violet-400",
  emerging: "bg-zinc-500",
};

export default function InterestProfileCard({ data }: Props) {
  const p = data.personality;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Your Interest Profile
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          How your personality maps to the 5 career dimensions
        </p>
      </div>

      {/* Personality Bars */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
        {DIMENSIONS.map((dim) => {
          const val = p[dim.key];
          return (
            <div key={dim.key}>
              <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                <span className={val < 40 ? "text-zinc-200 font-medium" : ""}>
                  {dim.left}
                </span>
                <span className={val > 60 ? "text-zinc-200 font-medium" : ""}>
                  {dim.right}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-zinc-800">
                {/* Center line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-700 -translate-x-px" />
                {/* Fill */}
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-700"
                  style={{
                    left: `${Math.min(val, 50)}%`,
                    right: val > 50 ? `${100 - val}%` : "50%",
                  }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-700"
                  style={{ left: `calc(${val}% - 6px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interest Clusters */}
      {data.interest_clusters.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">
            Your interest clusters
          </h3>
          <div className="space-y-2">
            {data.interest_clusters.map((c) => (
              <div
                key={c.cluster}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${SIGNAL_COLORS[c.signal]}`}
              >
                <div
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${SIGNAL_DOTS[c.signal]}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.cluster}</span>
                    <span className="text-xs opacity-70 uppercase tracking-wide">
                      {c.signal}
                    </span>
                  </div>
                  <p className="text-xs mt-1 opacity-70">
                    {c.activities.join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivators */}
      {data.motivators.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">What drives you</h3>
          <div className="space-y-1.5">
            {data.motivators.map((m, i) => (
              <div key={m} className="flex items-center gap-3">
                <span className="text-xs tabular-nums text-zinc-600 w-5">
                  #{i + 1}
                </span>
                <div
                  className="flex-1 h-8 rounded-lg flex items-center px-3 text-sm bg-zinc-900 border border-zinc-800"
                  style={{ opacity: 1 - i * 0.12 }}
                >
                  <span className="text-zinc-200">{m}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
