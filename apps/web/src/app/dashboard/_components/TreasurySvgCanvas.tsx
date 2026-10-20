'use client';

export function TreasurySvgCanvas() {
  return (
    <svg
      className="w-full h-full overflow-visible"
      viewBox="0 0 600 160"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartRevenueGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle grid lines */}
      <line x1="0" y1="10" x2="600" y2="10" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
      <line x1="0" y1="55" x2="600" y2="55" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
      <line x1="0" y1="105" x2="600" y2="105" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
      <line x1="0" y1="150" x2="600" y2="150" className="stroke-black/[0.06] dark:stroke-white/[0.03]" />

      {/* Disbursements line (Rose) */}
      <path
        d="M0,140 Q60,135 120,138 T240,145 T360,130 T480,142 T600,135"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />

      {/* Treasury Inflow fill area */}
      <path
        d="M0,85 Q60,80 120,95 T240,82 T360,45 T480,95 T600,75 L600,160 L0,160 Z"
        fill="url(#chartRevenueGlow)"
      />

      {/* Inflow line (Cyan) */}
      <path
        d="M0,85 Q60,80 120,95 T240,82 T360,45 T480,95 T600,75"
        fill="none"
        stroke="#0891b2"
        className="dark:stroke-[#22d3ee]"
        strokeWidth="2"
      />

      {/* Highlighted point at peak (360, 45) */}
      <circle cx="360" cy="45" r="4.5" className="fill-[#0891b2] dark:fill-[#22d3ee]" />
      <circle cx="360" cy="45" r="8" className="fill-[#0891b2]/30 dark:fill-[#22d3ee]/30 animate-pulse" />
    </svg>
  );
}
