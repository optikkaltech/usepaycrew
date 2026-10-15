export function PartnerLogos() {
  const partners = [
    { name: 'Direct Settlement', badge: '🏦 Instant Settlement' },
    { name: 'Quidax', badge: '⚡ Quidax OTC' },
    { name: 'Base', badge: '🔵 Base L2' },
    { name: 'TRON', badge: '🔴 TRON USDT' },
    { name: 'USDC', badge: '💵 Circle USDC' },
    { name: 'Tether', badge: '₮ Tether USDT' },
  ];

  return (
    <div className="mt-14 sm:mt-20">
      <div className="text-center mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#6b7280]">
          Built on Institutional Liquidity &amp; Compliance Rails
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-80 hover:opacity-100 transition-opacity">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white shadow-xs dark:border-white/[0.06] dark:bg-white/[0.02] px-3.5 py-1.5 text-caption sm:text-label-sm font-semibold tracking-tight text-gray-800 dark:text-white/90 select-none hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors"
          >
            <span>{partner.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
