"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ResultSectionProps {
  icon: string;
  title: string;
  subtitle: string;
  accentFrom: string;
  accentTo: string;
  accentText: string;
  accentBorder: string;
  dividerVia?: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export default function ResultSection({
  icon,
  title,
  subtitle,
  accentFrom,
  accentTo,
  accentText,
  accentBorder,
  dividerVia = "via-zinc-700/20",
  defaultOpen = true,
  badge,
  children,
}: ResultSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative">
      {/* Section container */}
      <div
        className={`relative overflow-hidden rounded-2xl border ${accentBorder} bg-gradient-to-br from-zinc-950/90 via-zinc-950/70 to-zinc-950/90 transition-all duration-300`}
      >
        {/* Subtle accent glow */}
        <div
          className={`pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-[0.04] bg-gradient-to-br ${accentFrom} ${accentTo}`}
        />

        {/* Clickable header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left group transition-colors hover:bg-white/[0.01]"
        >
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} border ${accentBorder} shrink-0 transition-transform group-hover:scale-105`}
          >
            <span className="text-base sm:text-lg">{icon}</span>
          </div>

          {/* Title & subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h2>
              {badge && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${accentText} bg-white/[0.04] border ${accentBorder}`}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Expand/collapse chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronDown
              className={`w-5 h-5 ${accentText} opacity-50 group-hover:opacity-80 transition-opacity`}
            />
          </motion.div>
        </button>

        {/* Divider */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div
                className={`mx-4 sm:mx-6 h-px bg-gradient-to-r from-transparent ${dividerVia} to-transparent`}
              />
              <div className="p-4 sm:p-6 pt-4 sm:pt-5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
