"use client";
import { useState } from "react";

interface Props {
  items: string[];
}

export default function ActionChecklist({ items }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const done = checked.size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Action Checklist</h2>
        <span className="text-xs text-zinc-500 tabular-nums">
          {done}/{items.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
          style={{
            width: items.length ? `${(done / items.length) * 100}%` : "0%",
          }}
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden divide-y divide-zinc-800">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-800/40 ${
              checked.has(i) ? "opacity-60" : ""
            }`}
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                checked.has(i)
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-zinc-600"
              }`}
            >
              {checked.has(i) && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm leading-relaxed ${checked.has(i) ? "line-through text-zinc-600" : "text-zinc-300"}`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>

      {done === items.length && items.length > 0 && (
        <div className="text-center py-3 text-sm text-emerald-400">
          ✓ All tasks complete — ready to launch
        </div>
      )}
    </div>
  );
}
