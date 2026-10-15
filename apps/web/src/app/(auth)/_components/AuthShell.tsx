'use client';

import { ReactNode } from 'react';
import { AuthShowcaseCard } from './AuthShowcaseCard';
import { useTheme } from '@/hooks';
import { SunIcon, MoonIcon } from '@/assets';

interface AuthShellProps {
  children: ReactNode;
  showcaseHeadline?: string;
}

export function AuthShell({ children, showcaseHeadline }: AuthShellProps) {
  const { isDark, toggleTheme, mounted } = useTheme();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] transition-colors duration-200 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-emerald/[0.06] dark:bg-brand-emerald/[0.12] blur-[120px]" />

      {/* Floating Theme Toggle */}
      {mounted && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[1100px] rounded-[32px] bg-white dark:bg-[#0e0f12] shadow-xl dark:shadow-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-colors duration-200">
        {/* Left Visual Showcase Card */}
        <AuthShowcaseCard headline={showcaseHeadline} />

        {/* Right Authentication Form Column */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 md:px-16 w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
