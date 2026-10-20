'use client';

import Link from 'next/link';
import {
  BellIcon,
  HomeIcon,
  SearchIcon,
  SlidersIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  EyeOffIcon,
  LogOutIcon,
  MenuIcon,
} from '@/assets';

interface DashboardTopBarProps {
  user?: any;
  companyName?: string;
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  pendingCount?: number;
}

export function DashboardTopBar({
  user,
  companyName,
  isDark,
  toggleTheme,
  mounted,
  isPrivacyMode,
  togglePrivacyMode,
  onLogout,
  onOpenMobileMenu,
  pendingCount = 3,
}: DashboardTopBarProps) {
  const displayName = companyName || user?.fullName || 'Kolawole & Team';

  return (
    <header className="flex h-14 sm:h-[57px] items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c0d11] px-4 sm:px-6 transition-colors duration-200 z-30 shrink-0 select-none">
      {/* Left side: Logo & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        {/* PayCrew Brand: Green 'P' Circle Badge + PayCrew */}
        <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black font-black text-[11px] shadow-sm dark:shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-transform group-hover:scale-105">
            P
          </div>
          <span className="text-label-sm font-bold text-[#0b3d2e] dark:text-white tracking-tight">
            PayCrew
          </span>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="hidden sm:inline-flex ml-0.5 text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle options"
          >
            <SlidersIcon className="h-3.5 w-3.5" />
          </button>
        </Link>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-white/[0.08]" />

        {/* Breadcrumb & Welcome */}
        <div className="hidden sm:flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-caption font-semibold text-gray-900 dark:text-white">
            <HomeIcon className="h-3 w-3 text-gray-400 dark:text-[#9ca3af] shrink-0" />
            <span className="truncate">Payroll Operations</span>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-[#8a8f98] truncate">
            Welcome back, {displayName}
          </span>
        </div>
      </div>

      {/* Right side: Search & Notification & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search input */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-[#f1f5f9] dark:bg-[#14151a] px-2.5 py-1 text-caption text-gray-500 dark:text-[#8a8f98]">
          <SearchIcon className="h-3 w-3" />
          <span className="w-28 sm:w-44 text-left truncate">Search contractor or run...</span>
          <kbd className="inline-flex rounded border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1d1f27] px-1 text-[9px] text-gray-600 dark:text-[#9ca3af] shadow-xs">
            ⌘ F
          </kbd>
        </div>

        {/* Privacy Mode Toggle */}
        <button
          type="button"
          onClick={togglePrivacyMode}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
          title={isPrivacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
        >
          {isPrivacyMode ? <EyeOffIcon className="h-3.5 w-3.5 text-brand-emerald" /> : <EyeIcon className="h-3.5 w-3.5" />}
        </button>

        {/* Theme Toggle */}
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
          </button>
        )}

        {/* Bell with approval count badge */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer">
          <BellIcon className="h-3.5 w-3.5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0b3d2e] text-[9px] font-bold text-white dark:bg-brand-emerald dark:text-black shadow-sm">
              {pendingCount}
            </span>
          )}
        </div>

        {/* Logout button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-destructive shadow-xs transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOutIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
