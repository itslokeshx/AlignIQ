import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              ALIGNIQ
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/market"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Market Intelligence
            </Link>
          </div>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground">
            Adaptive Career Alignment Intelligence
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-center">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} AlignIQ · Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
