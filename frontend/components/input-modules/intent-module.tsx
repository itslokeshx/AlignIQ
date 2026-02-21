"use client";
import { Label } from "@/components/ui/label";
import { UNIVERSAL_DOMAINS, INTENT_REASONS } from "@/lib/constants";
import { IntentProfile } from "@/lib/types";

interface Props {
  data: IntentProfile;
  onChange: (d: IntentProfile) => void;
}

const WORK_LOCATIONS = ["On-site", "Remote", "Hybrid", "Open to anything"];
const EDUCATION_OPENNESS = [
  {
    value: "Yes definitely",
    desc: "Ready to pursue a Master's / certification",
  },
  { value: "Maybe later", desc: "Open if it makes a strong difference" },
  { value: "Probably not", desc: "Prefer work experience over more study" },
  { value: "No", desc: "Looking to enter the workforce directly" },
];

export default function IntentModule({ data, onChange }: Props) {
  const set = (key: keyof IntentProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  const toggleReason = (r: string) => {
    const current = data.reasons;
    onChange({
      ...data,
      reasons: current.includes(r)
        ? current.filter((x) => x !== r)
        : [...current, r],
    });
  };

  const domainRoles = data.target_domain
    ? UNIVERSAL_DOMAINS[data.target_domain] || []
    : [];

  const formatSalary = (val: number) => {
    if (val >= 100) return "₹1 Cr+";
    if (val >= 50) return `₹${val}L`;
    return `₹${val}L`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Your career intent
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Where do you want to go? Be honest — we analyse both tracks
          regardless.
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

      {/* Role */}
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

      {/* Why this role */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Why do you want this career?
          <span className="text-zinc-500 font-normal ml-2">
            — pick all that apply (honestly)
          </span>
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {INTENT_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleReason(r)}
              className={`px-4 py-2.5 rounded-lg border text-sm text-left transition-all ${
                data.reasons.includes(r)
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Salary expectation */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Expected starting salary
          <span className="text-blue-400 font-semibold ml-2">
            {formatSalary(data.salary_expectation)}
          </span>
          <span className="text-zinc-500 font-normal ml-1">per year</span>
        </Label>
        <input
          type="range"
          min={3}
          max={100}
          step={1}
          value={data.salary_expectation}
          onChange={(e) => set("salary_expectation", parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>₹3L</span>
          <span>₹1 Cr+</span>
        </div>
      </div>

      {/* Work location */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Work location preference
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {WORK_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => set("work_location", loc)}
              className={`px-4 py-2.5 rounded-lg border text-sm transition-all ${
                data.work_location === loc
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Further education */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Open to further education for this career?
        </Label>
        <div className="space-y-2">
          {EDUCATION_OPENNESS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("open_to_education", opt.value)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                data.open_to_education === opt.value
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <span
                className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                  data.open_to_education === opt.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-zinc-600"
                }`}
              >
                {data.open_to_education === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <div>
                <div className="font-medium">{opt.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
