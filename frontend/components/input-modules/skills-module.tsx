"use client"

import { cn } from "@/lib/utils"
import { ALL_SKILLS } from "@/lib/constants"
import type { SkillsProfile } from "@/lib/types"

interface Props {
  data: SkillsProfile
  onChange: (data: SkillsProfile) => void
}

export function SkillsModule({ data, onChange }: Props) {
  const toggleSkill = (skill: string) => {
    const updated = data.selected_skills.includes(skill)
      ? data.selected_skills.filter((s) => s !== skill)
      : [...data.selected_skills, skill]
    onChange({ ...data, selected_skills: updated })
  }

  return (
    <div className="space-y-6">
      {/* Skill Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Select Your Skills</label>
          <span className="text-xs text-muted-foreground">
            {data.selected_skills.length} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => {
            const isSelected = data.selected_skills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* Self Rating */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Self-Rating</label>
          <span className="text-sm font-semibold font-mono text-foreground">
            {data.self_rating}/10
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={data.self_rating}
          onChange={(e) => onChange({ ...data, self_rating: parseInt(e.target.value) })}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>
    </div>
  )
}
