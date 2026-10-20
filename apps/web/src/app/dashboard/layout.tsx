'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppStrings } from '@/assets';
import { useAuth, useOnboardingGate, useTheme } from '@/hooks';
import { usePrivacyStore } from '@/store';
import { DashboardMobileDrawer } from './_components/DashboardMobileDrawer';
import { DashboardSidebar } from './_components/DashboardSidebar';
import { DashboardTopBar } from './_components/DashboardTopBar';

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
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-[#0a0b0e] text-foreground transition-colors duration-200 overflow-x-hidden">
      {/* Top Navbar */}
      <DashboardTopBar
        user={user}
        companyName={user?.companyName}
        isDark={isDark}
        toggleTheme={toggleTheme}
        mounted={mounted}
        isPrivacyMode={isPrivacyMode}
        togglePrivacyMode={togglePrivacyMode}
        onLogout={logout}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        pendingCount={3}
      />

      {/* Body: Left Sidebar + Main Content */}
      <div className="flex flex-1 min-h-[calc(100vh-57px)] w-full">
        <DashboardSidebar user={user} />
        <main className="flex-1 p-4 sm:p-6 bg-[#f8fafc] dark:bg-[#0a0b0e] transition-colors duration-200 overflow-y-auto w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      <DashboardMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        onLogout={logout}
        user={user}
      />
    </div>
  );
}
