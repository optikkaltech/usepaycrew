'use client';

import { ReactNode } from 'react';
import { AuthShowcaseCard } from './AuthShowcaseCard';

interface AuthShellProps {
  children: ReactNode;
  showcaseHeadline?: string;
}

export function AuthShell({ children, showcaseHeadline }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#EDEFF2]">
      <div className="w-full max-w-[1100px] rounded-[32px] bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] border border-neutral-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
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
