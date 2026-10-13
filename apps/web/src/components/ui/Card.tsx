import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glow';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'border border-border bg-card shadow-xs',
    elevated: 'border border-border bg-card shadow-md',
    glow: 'border border-brand-teal bg-card shadow-glow',
  };

  return (
    <div
      className={clsx('rounded-xl p-5 sm:p-6 transition-all duration-200', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
