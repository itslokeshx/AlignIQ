"use client";

interface Props {
  summary: string;
  name: string;
}

export default function ExecutiveSummary({ summary, name }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">
          Executive Intelligence Summary
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          AI-generated
        </span>
      </div>
      <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-zinc-500">Analysis for {name}</span>
        </div>
        <p className="text-zinc-300 text-sm leading-7 tracking-wide font-light">
          {summary}
        </p>
      </div>
    </div>
  );
}
