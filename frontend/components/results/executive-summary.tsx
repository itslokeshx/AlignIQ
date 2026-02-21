"use client";

import { motion } from "framer-motion";

interface Props {
  summary: string;
  name: string;
}

export default function ExecutiveSummary({ summary, name }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">
          AI Intelligence Summary
        </h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-blue-300 border border-blue-500/20 font-medium">
          AI-generated
        </span>
      </div>
      <div className="rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-200">{name}</span>
            <p className="text-[11px] text-zinc-600">
              Career Intelligence Analysis
            </p>
          </div>
        </div>
        <p className="text-zinc-300 text-sm leading-7 tracking-wide font-light">
          {summary}
        </p>
      </div>
    </motion.div>
  );
}
