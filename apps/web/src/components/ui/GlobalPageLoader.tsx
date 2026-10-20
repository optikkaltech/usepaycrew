'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2Icon } from '@/assets';
import { useLoadingStore } from '@/store';

export function GlobalPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading: storeLoading, message: storeMessage, stopLoading, startLoading } = useLoadingStore();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active state is driven either by store or route transition
  const isActive = visible || storeLoading;
  const currentMessage = storeMessage || 'Loading page...';

  // 1. Listen for link clicks to catch upcoming route transitions
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.origin);
      const isInternal = url.origin === window.location.origin;
      const isDifferentPath = url.pathname !== window.location.pathname || url.search !== window.location.search;
      const isSpecialTarget = target.target === '_blank' || target.hasAttribute('download');
      const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (isInternal && isDifferentPath && !isSpecialTarget && !isModifiedClick) {
        startLoading();
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [startLoading]);

  // 2. Animate progress bar when active
  useEffect(() => {
    if (isActive) {
      setVisible(true);
      setProgress(20);

      // Increment smoothly toward 85%
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 60) return prev + 15;
          if (prev < 85) return prev + 5;
          return prev;
        });
      }, 250);

      // Auto-clear after 8 seconds in case navigation was cancelled
      safetyTimeoutRef.current = setTimeout(() => {
        stopLoading();
        setVisible(false);
        setProgress(0);
      }, 8000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

      if (visible) {
        setProgress(100);
        const timeout = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 250);
        return () => clearTimeout(timeout);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [isActive, stopLoading, visible]);

  // 3. Stop loader when pathname or searchParams change (navigation finished)
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  if (!visible && !storeLoading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] select-none" aria-live="polite">
      {/* Top glowing progress hairline bar */}
      <div className="relative h-[3px] w-full bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-emerald via-brand-teal to-brand-emerald transition-all duration-300 ease-out shadow-[0_0_12px_rgba(57,255,20,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Centered Glassmorphic Loading Pill */}
      <div className="mt-3 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-card/90 dark:bg-[#141519]/90 px-4 py-1.5 shadow-lg backdrop-blur-md">
          <Loader2Icon className="h-4 w-4 animate-spin text-brand-emerald" />
          <span className="text-caption font-semibold tracking-tight text-foreground">
            {currentMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
