'use client';

import Link from 'next/link';
import { AppStrings, MenuIcon, MoonIcon, SunIcon, XIcon } from '@/assets';
import { useTheme } from '@/hooks';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Platform', href: '/#products' },
  { label: 'How It Works', href: '/#use-cases' },
  { label: 'Pricing', href: '/pricing' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4 sm:pt-5">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between rounded-full border px-4 sm:px-5 py-2 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-white/95 border-black/[0.08] shadow-xl backdrop-blur-xl dark:bg-[#121316]/95 dark:border-white/[0.08] dark:shadow-2xl'
            : 'bg-white/80 border-black/[0.06] shadow-md backdrop-blur-md dark:bg-[#121316]/75 dark:border-white/[0.08] dark:shadow-lg'
        }`}
      >
        {/* PayCrew Emblem & Name */}
        <Link href="/" prefetch={true} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-emerald text-black font-black text-caption shadow-[0_0_12px_rgba(6,214,160,0.4)]">
            P
          </div>
          <span className="text-label-md font-semibold text-gray-900 dark:text-white tracking-tight">
            {AppStrings.appName}
          </span>
        </Link>

        {/* Center Links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={true}
              className="text-label-sm text-gray-600 hover:text-black dark:text-[#8a8f98] dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions: Theme Toggle + Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] text-gray-700 hover:text-black dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-[#8a8f98] dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && isDark ? (
              <SunIcon className="h-4 w-4 text-amber-400" />
            ) : (
              <MoonIcon className="h-4 w-4 text-gray-700" />
            )}
          </button>

          <Link
            href="/login"
            prefetch={true}
            className="text-label-sm text-gray-600 hover:text-black dark:text-[#8a8f98] dark:hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            prefetch={true}
            className="inline-flex items-center justify-center rounded-full bg-[#0f1115] hover:bg-[#1e2025] text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black px-4 py-1.5 text-label-sm font-semibold transition-all shadow-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle & Theme button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-gray-700 dark:text-[#8a8f98]"
            aria-label="Toggle theme"
          >
            {mounted && isDark ? (
              <SunIcon className="h-4 w-4 text-amber-400" />
            ) : (
              <MoonIcon className="h-4 w-4 text-gray-700" />
            )}
          </button>
          <Link
            href="/register"
            prefetch={true}
            className="rounded-full bg-[#0f1115] text-white dark:bg-white dark:text-black px-3 py-1 text-caption font-semibold"
          >
            Sign Up
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-gray-700 dark:text-[#8a8f98]"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mt-2 w-full max-w-3xl rounded-2xl border border-black/[0.08] bg-white/95 dark:border-white/[0.08] dark:bg-[#121316]/95 p-4 backdrop-blur-xl shadow-2xl sm:hidden flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-label-md text-gray-700 hover:text-black hover:bg-black/[0.03] dark:text-[#8a8f98] dark:hover:text-white dark:hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between px-3">
            <Link
              href="/login"
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className="text-label-sm text-gray-700 dark:text-[#8a8f98]"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
