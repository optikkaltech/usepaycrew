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
} from '@/assets';
import { useAuth, useOnboardingGate } from '@/hooks';

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
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Mobile Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            P
          </div>
          <span className="text-display-sm text-foreground font-bold">{AppStrings.appName}</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background p-6 lg:hidden">
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <span className="text-display-sm font-bold text-foreground">{AppStrings.appName}</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-label-lg transition-colors min-h-[44px]',
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
          <div className="mt-auto pt-6 border-t border-border">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-label-lg text-destructive hover:bg-destructive/10 min-h-[44px]"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>{AppStrings.navigation.logout}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-secondary/40 lg:p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-brand">
            P
          </div>
          <span className="text-display-sm font-extrabold text-foreground">{AppStrings.appName}</span>
        </Link>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-label-md transition-colors min-h-[44px]',
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
            <p className="text-caption text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-label-md text-destructive hover:bg-destructive/10 min-h-[44px] transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>{AppStrings.navigation.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
