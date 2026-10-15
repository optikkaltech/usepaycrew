'use client';

import { DashboardTopBar } from './dashboard-preview/DashboardTopBar';
import { DashboardSidebar } from './dashboard-preview/DashboardSidebar';
import { DashboardExpenses } from './dashboard-preview/DashboardExpenses';
import { DashboardCashflow } from './dashboard-preview/DashboardCashflow';
import { PartnerLogos } from './PartnerLogos';

export function DashboardPreview() {
  return (
    <section className="relative px-4 pb-20 sm:pb-28 overflow-hidden">
      <div className="mx-auto max-w-5xl relative">
        {/* Luminous Horizon Light Beam above Dashboard */}
        <div className="pointer-events-none relative -mb-px flex flex-col items-center justify-center">
          {/* Soft upward ambient plume */}
          <div className="absolute -top-20 h-44 w-4/5 bg-gradient-to-t from-brand-emerald/[0.1] via-brand-emerald/[0.02] to-transparent dark:from-white/[0.16] dark:via-white/[0.04] dark:to-transparent blur-2xl" />
          {/* Intense horizontal horizon slit */}
          <div className="h-[2px] w-4/5 bg-gradient-to-r from-transparent via-brand-emerald/70 dark:via-white to-transparent lighting-horizon-slit" />
        </div>

        {/* Realistic Dashboard Mockup Window */}
        <div className="relative rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.1] dark:bg-[#0c0d10] shadow-xl dark:shadow-[0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden transition-colors duration-200">
          {/* Top Bar */}
          <DashboardTopBar />

          {/* Body: Sidebar + Main Content */}
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1 p-4 sm:p-6 bg-[#f8fafc] dark:bg-[#0a0b0e] transition-colors duration-200">
              <DashboardExpenses />
              <DashboardCashflow />
            </main>
          </div>
        </div>

        {/* Partner Rails Row */}
        <PartnerLogos />
      </div>
    </section>
  );
}
