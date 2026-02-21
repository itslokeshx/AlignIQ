"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
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

        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            Home
          </Link>
          <Link
            href="/market"
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            Market Analysis
          </Link>
          <Link
            href="/methodology"
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-200"
          >
            How it works?
          </Link>
        </div>
      </nav>
    </header>
  );
}
