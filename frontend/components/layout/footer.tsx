import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-violet-600">
              <span className="text-[9px] font-bold text-white">A</span>
            </div>
            <span className="text-xs font-medium text-zinc-500">ALIGNIQ</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/methodology"
              className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Methodology
            </Link>
            <span className="text-[11px] text-zinc-700">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
