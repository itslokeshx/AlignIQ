"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FIELDS_OF_STUDY, EDUCATION_LEVELS } from "@/lib/constants";
import { IdentityProfile } from "@/lib/types";

interface Props {
  data: IdentityProfile;
  onChange: (d: IdentityProfile) => void;
}

const CONSISTENCY_OPTIONS = [
  {
    value: "low",
    label: "Inconsistent",
    desc: "Varies a lot semester to semester",
  },
  {
    value: "medium",
    label: "Steady",
    desc: "Mostly stable with occasional dips",
  },
  { value: "high", label: "Consistent", desc: "Maintained throughout" },
];

export default function IdentityModule({ data, onChange }: Props) {
  const set = (key: keyof IdentityProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  const allFields = Object.values(FIELDS_OF_STUDY).flat();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Who are you?</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Basic identity information — this personalises your entire report.
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">Full Name</Label>
        <Input
          placeholder="e.g. Arjun Sharma"
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-11"
        />
      </div>

      {/* Age + Education Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm font-medium">Age</Label>
          <Input
            type="number"
            min={15}
            max={40}
            placeholder="21"
            value={data.age || ""}
            onChange={(e) => set("age", parseInt(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm font-medium">
            Education Level
          </Label>
          <select
            value={data.education_level}
            onChange={(e) => set("education_level", e.target.value)}
            className="w-full h-11 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select...</option>
            {EDUCATION_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Field of Study */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">
          Field of Study
        </Label>
        <select
          value={data.field_of_study}
          onChange={(e) => set("field_of_study", e.target.value)}
          className="w-full h-11 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Select your field...</option>
          {Object.entries(FIELDS_OF_STUDY).map(([category, fields]) => (
            <optgroup key={category} label={category}>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* CGPA */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">
          {data.education_level?.includes("10") ||
          data.education_level?.includes("12")
            ? "Percentage / CGPA"
            : "CGPA / GPA"}
          <span className="text-zinc-500 font-normal ml-2">
            (out of 10 — or leave 0 if not applicable)
          </span>
        </Label>
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          placeholder="7.5"
          value={data.cgpa || ""}
          onChange={(e) => set("cgpa", parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-11"
        />
      </div>

      {/* Academic Consistency */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Academic Consistency
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {CONSISTENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                set("consistency", opt.value as IdentityProfile["consistency"])
              }
              className={`p-3 rounded-lg border text-left transition-all ${
                data.consistency === opt.value
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs mt-0.5 text-zinc-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Backlogs */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Pending Backlogs / KTs
          <span className="text-zinc-500 font-normal ml-2">
            (if any — be honest, it helps calibrate)
          </span>
        </Label>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, "5+"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("backlogs", n === "5+" ? 5 : (n as number))}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                data.backlogs === (n === "5+" ? 5 : n)
                  ? "border-blue-500 bg-blue-500/10 text-blue-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
