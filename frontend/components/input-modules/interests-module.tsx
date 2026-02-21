"use client";
import { Label } from "@/components/ui/label";
import { ACTIVITIES, WORK_ENVIRONMENTS, MOTIVATORS } from "@/lib/constants";
import { InterestsProfile } from "@/lib/types";

interface Props {
  data: InterestsProfile;
  onChange: (d: InterestsProfile) => void;
}

export default function InterestsModule({ data, onChange }: Props) {
  const toggle = <K extends "activities" | "work_environments" | "motivators">(
    key: K,
    val: string,
    max?: number,
  ) => {
    const current = data[key] as string[];
    if (current.includes(val)) {
      onChange({ ...data, [key]: current.filter((v) => v !== val) });
    } else if (!max || current.length < max) {
      onChange({ ...data, [key]: [...current, val] });
    }
  };

  const setTopic = (i: number, val: string) => {
    const topics = [...(data.topics || ["", "", ""])];
    topics[i] = val;
    onChange({ ...data, topics });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">What moves you?</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Your interests and energy shape your interest profile.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Activities you enjoy
          <span className="text-zinc-500 font-normal ml-2">
            — pick all that genuinely excite you
          </span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACTIVITIES.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => toggle("activities", act.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                data.activities.includes(act.id)
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <span className="text-base">{act.icon}</span>
              <span className="leading-snug">{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topics they nerd out on */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Topics you genuinely nerd out on
          <span className="text-zinc-500 font-normal ml-2">— up to 3</span>
        </Label>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              placeholder={
                [
                  "e.g. Astrophysics",
                  "e.g. Behavioural economics",
                  "e.g. Typography & type design",
                ][i]
              }
              value={(data.topics || [])[i] || ""}
              onChange={(e) => setTopic(i, e.target.value)}
              className="w-full h-10 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>
      </div>

      {/* Work Environments */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Work environments that appeal to you
          <span className="text-zinc-500 font-normal ml-2">
            — choose up to 2
          </span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {WORK_ENVIRONMENTS.map((env) => (
            <button
              key={env}
              type="button"
              onClick={() => toggle("work_environments", env, 2)}
              className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                data.work_environments.includes(env)
                  ? "border-emerald-500 bg-emerald-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              } ${data.work_environments.length >= 2 && !data.work_environments.includes(env) ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Motivators */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          What matters most to you in a career?
          <span className="text-zinc-500 font-normal ml-2">— top 3</span>
        </Label>
        <div className="space-y-2">
          {MOTIVATORS.map((m) => {
            const idx = data.motivators.indexOf(m);
            const selected = idx !== -1;
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggle("motivators", m, 3)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                  selected
                    ? "border-violet-500 bg-violet-500/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                } ${data.motivators.length >= 3 && !selected ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span>{m}</span>
                {selected && (
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {data.motivators.length > 0 && (
          <p className="text-xs text-zinc-500">
            Ranked: {data.motivators.join(" → ")}
          </p>
        )}
      </div>
    </div>
  );
}
