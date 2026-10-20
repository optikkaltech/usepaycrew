'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Images } from '@/assets';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: { full: { w: 140, h: 23 }, icon: 32 },
  md: { full: { w: 185, h: 30 }, icon: 42 },
  lg: { full: { w: 225, h: 37 }, icon: 50 },
  xl: { full: { w: 275, h: 45 }, icon: 60 },
};

export function BrandLogo({
  variant = 'full',
  size = 'md',
  href,
  className = '',
  priority = false,
}: BrandLogoProps) {
  const dimensions = SIZE_MAP[size];
  let content: React.ReactNode;

  if (variant === 'icon') {
    const dim = dimensions.icon;
    content = (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-brand transition-transform hover:scale-105 ${className}`}
        style={{ width: dim, height: dim }}
      >
        <Image
          src={Images.logo.icon}
          alt="PayCrew Emblem"
          width={dim}
          height={dim}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </div>
    );
  } else if (variant === 'mark') {
    const dim = dimensions.icon;
    content = (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: dim, height: dim }}
      >
        <Image
          src={Images.logo.iconMark}
          alt="PayCrew Mark"
          width={dim}
          height={dim}
          priority={priority}
          className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(57,255,20,0.6)]"
        />
      </div>
    );
  } else {
    // Full Wordmark with Icon (Dual-rendered via CSS for 100% reliable instant light/dark switching)
    const { w, h } = dimensions.full;

    content = (
      <div
        className={`relative inline-flex items-center shrink-0 transition-opacity hover:opacity-95 ${className}`}
        style={{ width: w, height: h }}
      >
        {/* Light mode: Deep Pine #0B3D2E + Rich Emerald #007A4D (high contrast on white/light) */}
        <Image
          src={Images.logo.primary}
          alt="usePayCrew"
          width={w}
          height={h}
          priority={priority}
          className="h-full w-auto object-contain dark:hidden"
        />
        {/* Dark mode: White #FFFFFF + Electric Lime #39FF14 (high contrast on dark/nocturnal) */}
        <Image
          src={Images.logo.white}
          alt="usePayCrew"
          width={w}
          height={h}
          priority={priority}
          className="hidden dark:block h-full w-auto object-contain dark:drop-shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all"
        />
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
