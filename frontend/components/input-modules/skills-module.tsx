"use client";
import { Label } from "@/components/ui/label";
import {
  FIELD_SKILL_MAP,
  FIELD_TO_SKILL_CATEGORY,
  UNIVERSAL_SOFT_SKILLS,
  KNOWN_LANGUAGES,
} from "@/lib/constants";
import { SkillsProfile } from "@/lib/types";

interface Props {
  data: SkillsProfile;
  onChange: (d: SkillsProfile) => void;
  fieldOfStudy: string; // passed from parent so skills are dynamic
}

export default function SkillsModule({ data, onChange, fieldOfStudy }: Props) {
  // Determine skill bucket from field of study
  const category = FIELD_TO_SKILL_CATEGORY[fieldOfStudy] || "tech";
  const domainSkills = FIELD_SKILL_MAP[category] || FIELD_SKILL_MAP["tech"];

  const toggleSkill = (skill: string) => {
    const current = data.selected_skills;
    onChange({
      ...data,
      selected_skills: current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill],
    });
  };

  const toggleLang = (lang: string) => {
    const current = data.languages_known;
    onChange({
      ...data,
      languages_known: current.includes(lang)
        ? current.filter((l) => l !== lang)
        : [...current, lang],
    });
  };

  const set = (key: keyof SkillsProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Your skills</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Select every skill you can use with at least moderate confidence.
          {fieldOfStudy && (
            <span className="text-zinc-500">
              {" "}
              Showing skills for{" "}
              <span className="text-zinc-300">{fieldOfStudy}</span>.
            </span>
          )}
        </p>
      </div>

      {/* Domain-specific skills */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Domain skills
          <span className="text-zinc-500 font-normal ml-2">
            — specific to your field
          </span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {domainSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                data.selected_skills.includes(skill)
                  ? "border-blue-500 bg-blue-500/15 text-blue-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Universal soft skills — always shown */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Soft skills
          <span className="text-zinc-500 font-normal ml-2">
            — transferable across all fields
          </span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {UNIVERSAL_SOFT_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                data.selected_skills.includes(skill)
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Proficiency rating */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Overall proficiency in selected skills
          <span className="text-blue-400 font-semibold ml-2">
            {data.proficiency_rating}/10
          </span>
        </Label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={data.proficiency_rating}
          onChange={(e) => set("proficiency_rating", parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Beginner — just started</span>
          <span>Expert — used in real projects</span>
        </div>
      </div>

      {/* Languages known */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Languages you can communicate in
        </Label>
        <div className="flex flex-wrap gap-2">
          {KNOWN_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                data.languages_known.includes(lang)
                  ? "border-violet-500 bg-violet-500/15 text-violet-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.selected_skills.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2">
            Selected ({data.selected_skills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.selected_skills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
