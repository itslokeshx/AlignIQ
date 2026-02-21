"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.href = "/";
    }
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 py-3.5">
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-shadow">
            <span className="text-[11px] font-bold text-white">A</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            ALIGNIQ
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            Home
          </Link>
          <Link
            href="/market"
            onClick={closeMobile}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            Market Analysis
          </Link>
          <Link
            href="/methodology"
            onClick={closeMobile}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            How it works?
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4H14M2 8H14M2 12H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/[0.04] bg-zinc-950/95 backdrop-blur-xl px-5 py-3 flex flex-col gap-1.5">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/market"
            onClick={closeMobile}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            Market Analysis
          </Link>
          <Link
            href="/methodology"
            onClick={closeMobile}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            How it works?
          </Link>
        </div>
      )}
    </header>
  );
}
