"use client";
import { Label } from "@/components/ui/label";
import {
  FIELD_SKILL_MAP,
  FIELD_TO_SKILL_CATEGORY,
  UNIVERSAL_SOFT_SKILLS,
  KNOWN_LANGUAGES,
} from "@/lib/constants";
import type { ExperienceSkillsProfile } from "@/lib/types";

interface Props {
  data: ExperienceSkillsProfile;
  onChange: (d: ExperienceSkillsProfile) => void;
  fieldOfStudy: string;
}

export default function ExperienceSkillsModule({
  data,
  onChange,
  fieldOfStudy,
}: Props) {
  const category = FIELD_TO_SKILL_CATEGORY[fieldOfStudy] || "tech";
  const domainSkills = FIELD_SKILL_MAP[category] || FIELD_SKILL_MAP["tech"];

  const toggleSkill = (skill: string) => {
    const list = data.selected_skills;
    onChange({
      ...data,
      selected_skills: list.includes(skill)
        ? list.filter((s) => s !== skill)
        : [...list, skill],
    });
  };

  const toggleLang = (lang: string) => {
    const list = data.languages_known;
    onChange({
      ...data,
      languages_known: list.includes(lang)
        ? list.filter((l) => l !== lang)
        : [...list, lang],
    });
  };

  const set = (key: keyof ExperienceSkillsProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Skills & Experience
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">
          What you know and what you&apos;ve done — powers 60% of your CRI
          score.
        </p>
      </div>

      {/* Domain skills */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Domain skills
          {fieldOfStudy && (
            <span className="text-zinc-500 font-normal ml-2">
              — for {fieldOfStudy}
            </span>
          )}
        </Label>
        <div className="flex flex-wrap gap-2">
          {domainSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${data.selected_skills.includes(skill)
                  ? "border-blue-500 bg-blue-500/15 text-blue-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Soft skills */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">Soft skills</Label>
        <div className="flex flex-wrap gap-2">
          {UNIVERSAL_SOFT_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${data.selected_skills.includes(skill)
                  ? "border-violet-500 bg-violet-500/15 text-violet-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Proficiency slider */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Overall skill proficiency
          <span className="text-zinc-500 font-normal ml-2">
            — {data.proficiency_rating}/10
          </span>
        </Label>
        <input
          type="range"
          min={1}
          max={10}
          value={data.proficiency_rating}
          onChange={(e) => set("proficiency_rating", parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Known languages
        </Label>
        <div className="flex flex-wrap gap-2">
          {KNOWN_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${data.languages_known.includes(lang)
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/60" />

      {/* Experience section — compact toggle grid */}
      <div className="space-y-4">
        <Label className="text-zinc-300 text-sm font-medium">
          Your experience
        </Label>

        {/* Internships */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-zinc-400">Internships completed</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, "4+"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  set("internships", n === "4+" ? 4 : (n as number))
                }
                className={`w-9 h-8 rounded-lg text-xs font-medium border transition-all ${data.internships === (n === "4+" ? 4 : n)
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-zinc-400">Projects built</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, "4+"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set("projects", n === "4+" ? 4 : (n as number))}
                className={`w-9 h-8 rounded-lg text-xs font-medium border transition-all ${data.projects === (n === "4+" ? 4 : n)
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Readiness */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-zinc-400">Career readiness feel</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="range"
              min={1}
              max={10}
              value={data.readiness_rating}
              onChange={(e) =>
                set("readiness_rating", parseInt(e.target.value))
              }
              className="flex-1 sm:w-28 accent-blue-500"
            />
            <span className="text-xs text-zinc-500 tabular-nums w-6 text-right">
              {data.readiness_rating}
            </span>
          </div>
        </div>

        {/* Toggle row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { key: "leadership" as const, label: "Led a team / org" },
            { key: "competitions" as const, label: "Won a competition" },
            { key: "volunteer" as const, label: "Volunteered" },
            { key: "earned_from_skill" as const, label: "Earned from skill" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => set(key, !data[key])}
              className={`rounded-lg border px-3 py-2.5 text-xs font-medium text-left transition-all ${data[key]
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-500 hover:border-zinc-600"
                }`}
            >
              <span className="mr-1.5">{data[key] ? "✓" : "○"}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
