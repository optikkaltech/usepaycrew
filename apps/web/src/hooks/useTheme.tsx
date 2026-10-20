'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

// Global listeners for instant cross-component synchronization
const listeners = new Set<(t: Theme) => void>();

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDocDark = document.documentElement.classList.contains('dark');
    const stored = localStorage.getItem('paycrew_theme_mode') as Theme | null;
    const initialTheme: Theme = stored === 'dark' || isDocDark ? 'dark' : 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const handler = (t: Theme) => setThemeState(t);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem('paycrew_theme_mode', t);
      localStorage.setItem('paycrew_theme', t);
    } catch (_) {}
    listeners.forEach((listener) => listener(t));
  };

  const toggleTheme = () => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const nextTheme: Theme = currentIsDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
    mounted,
  };
}
