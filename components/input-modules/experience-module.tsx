"use client"

import { cn } from "@/lib/utils"
import type { ExperienceProfile } from "@/lib/types"

interface Props {
  data: ExperienceProfile
  onChange: (data: ExperienceProfile) => void
}

export function ExperienceModule({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Internships */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Internships Completed</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...data, internships: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                data.internships === val
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              {val === 3 ? "3+" : val}
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Projects Built</label>
          <span className="text-sm font-semibold font-mono text-foreground">{data.projects}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={data.projects}
          onChange={(e) => onChange({ ...data, projects: parseInt(e.target.value) })}
          className="w-full accent-foreground"
        />
      </div>

      {/* Hackathons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Hackathons Participated</label>
          <span className="text-sm font-semibold font-mono text-foreground">{data.hackathons}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={data.hackathons}
          onChange={(e) => onChange({ ...data, hackathons: parseInt(e.target.value) })}
          className="w-full accent-foreground"
        />
      </div>

      {/* Leadership */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Leadership Role</label>
        <div className="flex gap-2">
          {[false, true].map((val) => (
            <button
              key={String(val)}
              onClick={() => onChange({ ...data, leadership: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                data.leadership === val
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
