'use client';

import {
  BanknoteIcon,
  BellIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  LayersIcon,
  MenuIcon,
  MoonIcon,
  SlidersIcon,
  SunIcon,
  TrendingUpIcon,
  WalletIcon,
  LogOutIcon,
} from '@/assets';
import { ContractorTab } from './contractor.types';

interface WorkerHeaderProps {
  firstName: string;
  fullName?: string;
  activeTab: ContractorTab;
  liveRate: number;
  isDark: boolean;
  mounted?: boolean;
  toggleTheme: () => void;
  onOpenMobileMenu: () => void;
  isPrivacyMode?: boolean;
  togglePrivacyMode?: () => void;
  onLogout?: () => void;
}

const TAB_CONFIG: Record<ContractorTab, { label: string; icon: any }> = {
  overview: { label: 'Overview', icon: LayersIcon },
  earnings: { label: 'Earnings', icon: BanknoteIcon },
  wallet: { label: 'Wallet & Payouts', icon: WalletIcon },
  convert: { label: 'Convert & Withdraw', icon: TrendingUpIcon },
  banks: { label: 'Bank Accounts', icon: CreditCardIcon },
  settings: { label: 'Profile & Settings', icon: SlidersIcon },
};

export function WorkerHeader({
  firstName,
  fullName,
  activeTab,
  liveRate,
  isDark,
  mounted = true,
  toggleTheme,
  onOpenMobileMenu,
  isPrivacyMode,
  togglePrivacyMode,
  onLogout,
}: WorkerHeaderProps) {
  const currentTab = TAB_CONFIG[activeTab] || TAB_CONFIG.overview;
  const TabIcon = currentTab.icon;

  const initials = fullName
    ? fullName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : firstName.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-14 sm:h-[57px] items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c0d11] px-4 sm:px-6 transition-colors duration-200 z-30 shrink-0 select-none">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer shrink-0"
          aria-label="Toggle Navigation"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-caption font-semibold text-gray-900 dark:text-white">
            <TabIcon className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{currentTab.label}</span>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-[#8a8f98] truncate">
            Welcome back, {firstName}
          </span>
        </div>
      </div>

      {/* Right: Live Market Rate + Privacy + Theme + Bell + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live USD/NGN Rate Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-[#f1f5f9] dark:bg-[#14151a] px-2.5 py-1 text-caption text-gray-700 dark:text-[#9ca3af]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0b3d2e] dark:bg-brand-emerald animate-pulse" />
          <span className="font-semibold text-foreground text-[11px]">
            1 USD ≈ ₦{liveRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Privacy Mode Toggle */}
        {togglePrivacyMode && (
          <button
            type="button"
            onClick={togglePrivacyMode}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
            title={isPrivacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
          >
            {isPrivacyMode ? (
              <EyeOffIcon className="h-3.5 w-3.5 text-primary" />
            ) : (
              <EyeIcon className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
          title="Toggle theme"
        >
          {mounted && isDark ? (
            <SunIcon className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <MoonIcon className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer">
          <BellIcon className="h-3.5 w-3.5" />
        </div>

        {/* Contractor Avatar Pill */}
        <div className="flex items-center gap-2 pl-1 border-l border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black font-bold text-[10px] shadow-xs">
            {initials}
          </div>
          <span className="hidden lg:inline text-caption font-semibold text-foreground truncate max-w-[120px]">
            {fullName || firstName}
          </span>
        </div>

        {/* Sign out button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#14151a] text-gray-600 dark:text-[#9ca3af] hover:text-destructive hover:bg-destructive/10 shadow-xs transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOutIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
