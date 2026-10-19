'use client';

import { MenuIcon, SunIcon, MoonIcon } from '@/assets';

interface WorkerHeaderProps {
  firstName: string;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenMobileMenu: () => void;
  showWelcome: boolean;
}

export function WorkerHeader({
  firstName,
  isDark,
  toggleTheme,
  onOpenMobileMenu,
  showWelcome,
}: WorkerHeaderProps) {
  return (
    <>
      {/* Mobile Top Navbar */}
      <header className="flex md:hidden items-center justify-between p-4 border-b border-border bg-card">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
        >
          <MenuIcon className="h-4 w-4" />
        </button>
        <span className="font-bold text-label-md">PayCrew Contractor</span>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
        >
          {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        </button>
      </header>

      {/* Desktop Welcome Banner */}
      {showWelcome && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-sm font-black text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
              Your USDT earnings and Naira conversions at a glance.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        </div>
      )}
    </>
  );
}
