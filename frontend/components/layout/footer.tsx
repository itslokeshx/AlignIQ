export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <span className="text-xs font-bold text-background">A</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">ALIGNIQ</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Adaptive Career Alignment Intelligence
        </p>
      </div>
    </footer>
  )
}
