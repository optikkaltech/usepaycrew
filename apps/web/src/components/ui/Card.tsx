import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glow';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'border border-black/[0.08] dark:border-white/[0.08] bg-card shadow-xs',
    elevated: 'border border-black/[0.08] dark:border-white/[0.08] bg-card shadow-sm',
    glow: 'border border-brand-teal/40 bg-card shadow-glow',
  };

  return (
    <div
      className={clsx('rounded-2xl p-5 sm:p-6 transition-all duration-200', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
