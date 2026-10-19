export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground transition-colors select-none">
      <div className="relative flex flex-col items-center gap-4">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -inset-6 rounded-full bg-brand-emerald/15 blur-2xl animate-pulse" />

        {/* Brand Emblem */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-emerald to-[#03b888] text-black font-black text-xl shadow-[0_0_24px_rgba(6,214,160,0.4)] animate-bounce duration-1000">
          P
        </div>

        {/* Loading Label & Shimmer Bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-label-sm font-semibold text-foreground tracking-tight">
            PayCrew
          </p>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-full bg-brand-emerald animate-[shimmer_1.5s_infinite] origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
}
