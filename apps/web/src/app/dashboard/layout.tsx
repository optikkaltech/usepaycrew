'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  AppStrings,
  LayersIcon,
  UsersIcon,
  CreditCardIcon,
  BuildingIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/assets';
import { useAuth, useOnboardingGate, useTheme } from '@/hooks';
import { MaskedField } from '@/components/ui/MaskedField';
import { usePrivacyStore } from '@/store';
import { SunIcon, MoonIcon } from '@/assets';

import { DashboardMobileDrawer } from './_components/DashboardMobileDrawer';

const navItems = [
  { href: '/dashboard', label: AppStrings.navigation.dashboard, icon: LayersIcon },
  { href: '/dashboard/workers', label: AppStrings.navigation.workers, icon: UsersIcon },
  { href: '/dashboard/payroll', label: AppStrings.navigation.payroll, icon: CreditCardIcon },
  { href: '/dashboard/settings', label: AppStrings.navigation.settings, icon: BuildingIcon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, fetchProfile, user } = useAuth();
  const { isReady } = useOnboardingGate();
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyStore();
  const { isDark, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-body-sm text-muted-foreground">{AppStrings.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] transition-colors duration-200 lg:flex-row relative overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-emerald text-black font-black text-caption shadow-[0_0_12px_rgba(6,214,160,0.4)]">
            P
          </div>
          <span className="text-display-sm text-foreground font-bold">{AppStrings.appName}</span>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={togglePrivacyMode}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
            title={isPrivacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
            aria-label="Toggle Privacy Mode"
          >
            {isPrivacyMode ? <EyeOffIcon className="h-4 w-4 text-brand-emerald" /> : <EyeIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <DashboardMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        navItems={navItems}
        onLogout={logout}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card/70 lg:backdrop-blur-md lg:p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-emerald text-black font-black text-caption shadow-[0_0_12px_rgba(6,214,160,0.4)]">
              P
            </div>
            <span className="text-display-sm font-extrabold text-foreground tracking-tight">{AppStrings.appName}</span>
          </Link>
          <div className="flex items-center gap-1">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {isDark ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
              </button>
            )}
            <button
              onClick={togglePrivacyMode}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              title={isPrivacyMode ? 'Privacy Mode Active' : 'Turn on Privacy Mode'}
              aria-label="Toggle Privacy Mode"
            >
              {isPrivacyMode ? <EyeOffIcon className="h-3.5 w-3.5 text-brand-emerald" /> : <EyeIcon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-label-md transition-all min-h-[44px]',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-brand'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border">
          <div className="mb-3 px-3">
            <p className="text-label-md text-foreground font-medium truncate">{user?.fullName || 'Employer Admin'}</p>
            <MaskedField
              value={user?.email || ''}
              maskedValue={user?.maskedEmail}
              type="email"
              allowReveal={true}
              allowCopy={true}
              className="text-muted-foreground text-caption"
            />
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-label-md text-destructive hover:bg-destructive/10 min-h-[44px] transition-colors cursor-pointer"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>{AppStrings.navigation.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full relative z-10 transition-colors duration-200">
        {/* Subtle ambient backlight glow behind dashboard content */}
        <div className="pointer-events-none absolute right-10 top-10 h-[250px] w-[380px] rounded-full bg-brand-emerald/[0.05] dark:bg-brand-emerald/[0.08] blur-[100px] -z-10" />
        {children}
      </main>
    </div>
  );
}
