"use client";
import { Label } from "@/components/ui/label";
import { UNIVERSAL_DOMAINS, ACTIVITIES } from "@/lib/constants";
import type { CareerGoalProfile } from "@/lib/types";

interface Props {
  data: CareerGoalProfile;
  onChange: (d: CareerGoalProfile) => void;
}

export default function CareerGoalModule({ data, onChange }: Props) {
  const set = (key: keyof CareerGoalProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  const domainRoles = data.target_domain
    ? UNIVERSAL_DOMAINS[data.target_domain] || []
    : [];

  const toggleActivity = (id: string) => {
    const list = data.activities;
    onChange({
      ...data,
      activities: list.includes(id)
        ? list.filter((a) => a !== id)
        : [...list, id],
    });
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-white">Career goal</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Your target role drives the entire analysis. Your activity picks feed
          the ML personality model.
        </p>
      </div>

      {/* Domain */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">
          Target domain
        </Label>
        <select
          value={data.target_domain}
          onChange={(e) =>
            onChange({
              ...data,
              target_domain: e.target.value,
              target_role: "",
            })
          }
          className="w-full h-11 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a domain...</option>
          {Object.keys(UNIVERSAL_DOMAINS).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Role — cascading from domain */}
      {data.target_domain && (
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm font-medium">
            Specific role you want to pursue
          </Label>
          <select
            value={data.target_role}
            onChange={(e) => set("target_role", e.target.value)}
            className="w-full h-11 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a role...</option>
            {domainRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Activities */}
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
              onClick={() => toggleActivity(act.id)}
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
    </div>
  );
}
