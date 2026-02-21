"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { DOMAINS, ROLE_SUGGESTIONS } from "@/lib/constants"
import type { IntentProfile } from "@/lib/types"

interface Props {
  data: IntentProfile
  onChange: (data: IntentProfile) => void
}

export function IntentModule({ data, onChange }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const toggleDomain = (domain: string) => {
    const updated = data.interested_domains.includes(domain)
      ? data.interested_domains.filter((d) => d !== domain)
      : [...data.interested_domains, domain]
    onChange({ ...data, interested_domains: updated })
  }

  const filteredSuggestions = ROLE_SUGGESTIONS.filter((r) =>
    r.toLowerCase().includes(data.target_role.toLowerCase())
  )

  const formatSalary = (val: number) => {
    if (val >= 100) return `${(val / 100).toFixed(0)}Cr`
    return `${val}L`
  }

  return (
    <div className="space-y-6">
      {/* Domains */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Interested Domains</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {DOMAINS.map((domain) => {
            const isSelected = data.interested_domains.includes(domain.id)
            return (
              <button
                key={domain.id}
                onClick={() => toggleDomain(domain.id)}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/30"
                )}
              >
                <span className="text-sm font-medium">{domain.label}</span>
                <span className={cn("text-xs", isSelected ? "text-background/70" : "text-muted-foreground")}>
                  {domain.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Target Role */}
      <div className="relative space-y-2">
        <label className="text-sm font-medium text-foreground">Target Job Role</label>
        <input
          type="text"
          value={data.target_role}
          onChange={(e) => onChange({ ...data, target_role: e.target.value })}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="e.g. ML Engineer"
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground"
        />
        {showSuggestions && data.target_role && filteredSuggestions.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-border bg-card p-1 shadow-lg">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                onMouseDown={() => {
                  onChange({ ...data, target_role: suggestion })
                  setShowSuggestions(false)
                }}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-secondary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Salary Expectation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Salary Expectation (Annual)</label>
          <span className="text-sm font-semibold font-mono text-foreground">
            {formatSalary(data.salary_expectation)}
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="50"
          step="1"
          value={data.salary_expectation}
          onChange={(e) => onChange({ ...data, salary_expectation: parseInt(e.target.value) })}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 LPA</span>
          <span>50 LPA+</span>
        </div>
      </div>

      {/* Work Style */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Work Style Preference</label>
        <div className="flex gap-2">
          {(["remote", "hybrid", "onsite"] as const).map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...data, work_style: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors",
                data.work_style === val
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              {val === "onsite" ? "On-site" : val}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Tolerance */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Risk Tolerance</label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...data, risk_tolerance: val })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors",
                data.risk_tolerance === val
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
