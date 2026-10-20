'use client';

import {
  BellIcon,
  HomeIcon,
  SearchIcon,
  SlidersIcon,
} from '@/assets';

export function DashboardTopBar() {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c0d11] px-4 py-3 sm:px-6 transition-colors duration-200">
      {/* Left side: Logo & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* PayCrew Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black font-black text-[11px] shadow-sm dark:shadow-[0_0_8px_rgba(57,255,20,0.4)]">
            P
          </div>
          <span className="text-label-sm font-bold text-[#0b3d2e] dark:text-white tracking-tight">
            PayCrew
          </span>
          <button
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            <SlidersIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-white/[0.08]" />

        {/* Breadcrumb & Welcome */}
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-caption font-semibold text-gray-900 dark:text-white">
            <HomeIcon className="h-3 w-3 text-gray-400 dark:text-[#9ca3af]" />
            <span>Payroll Operations</span>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-[#8a8f98]">
            Welcome back, Kolawole &amp; Team
          </span>
        </div>
      </div>

      {/* Right side: Search & Notification */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-[#f1f5f9] dark:bg-[#14151a] px-2.5 py-1 text-caption text-gray-500 dark:text-[#8a8f98]">
          <SearchIcon className="h-3 w-3" />
          <span className="w-24 sm:w-44 text-left truncate">Search contractor or run...</span>
          <kbd className="hidden sm:inline-flex rounded border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1d1f27] px-1 text-[9px] text-gray-600 dark:text-[#9ca3af] shadow-xs">
            ⌘ F
          </kbd>
        </div>

        {/* Bell with approval count badge */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer">
          <BellIcon className="h-3.5 w-3.5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0b3d2e] text-[9px] font-bold text-white dark:bg-brand-emerald dark:text-black shadow-sm">
            3
          </span>
        </div>
      </div>
    </div>
  );
}
