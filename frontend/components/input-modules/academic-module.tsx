"use client"

import { cn } from "@/lib/utils"
import type { AcademicProfile } from "@/lib/types"

interface Props {
  data: AcademicProfile
  onChange: (data: AcademicProfile) => void
}

export function AcademicModule({ data, onChange }: Props) {
  const cgpaColor =
    data.cgpa >= 7.5 ? "text-success" : data.cgpa >= 6 ? "text-warning" : "text-destructive"

  return (
    <div className="space-y-6">
      {/* CGPA */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">CGPA</label>
          <span className={cn("text-sm font-semibold font-mono", cgpaColor)}>
            {data.cgpa.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={data.cgpa}
          onChange={(e) => onChange({ ...data, cgpa: parseFloat(e.target.value) })}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.0</span>
          <span>10.0</span>
        </div>
      </div>

      {/* Backlogs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Active Backlogs</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...data, backlogs: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                data.backlogs === val
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              {val === 3 ? "3+" : val}
            </button>
          ))}
        </div>
      </div>

      {/* Aptitude Score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Aptitude Score</label>
          <span className="text-sm font-semibold font-mono text-foreground">{data.aptitude_score}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={data.aptitude_score}
          onChange={(e) => onChange({ ...data, aptitude_score: parseInt(e.target.value) })}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Consistency */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Academic Consistency</label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...data, consistency: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors",
                data.consistency === val
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
