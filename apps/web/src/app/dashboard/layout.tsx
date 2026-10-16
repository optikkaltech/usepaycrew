'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppStrings,
  MenuIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  SunIcon,
  MoonIcon,
} from '@/assets';
import { useAuth, useOnboardingGate, useTheme } from '@/hooks';
import { usePrivacyStore } from '@/store';
import { DashboardMobileDrawer } from './_components/DashboardMobileDrawer';
import { DashboardSidebar } from './_components/DashboardSidebar';

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
        onLogout={logout}
        user={user}
      />

      {/* Desktop Sidebar (Modularized & Redesigned) */}
      <DashboardSidebar
        user={user}
        logout={logout}
        isDark={isDark}
        toggleTheme={toggleTheme}
        mounted={mounted}
        isPrivacyMode={isPrivacyMode}
        togglePrivacyMode={togglePrivacyMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full relative z-10 transition-colors duration-200 overflow-y-auto">
        <div className="pointer-events-none absolute right-10 top-10 h-[250px] w-[380px] rounded-full bg-brand-emerald/[0.05] dark:bg-brand-emerald/[0.08] blur-[100px] -z-10" />
        {children}
      </main>
    </div>
  );
}
