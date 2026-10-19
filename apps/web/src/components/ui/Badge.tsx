import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'neutral'
  | 'secondary'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  withDot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-brand-sky/10 text-brand-sky border-brand-sky/20',
  neutral: 'bg-secondary text-muted-foreground border-border',
  secondary: 'bg-secondary text-foreground border-border',
  outline: 'border border-border text-foreground bg-transparent',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  destructive: 'bg-destructive',
  info: 'bg-brand-sky',
  neutral: 'bg-muted-foreground',
  secondary: 'bg-foreground',
  outline: 'bg-muted-foreground',
};

export function Badge({
  variant = 'neutral',
  withDot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-medium border select-none transition-colors',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {withDot && (
        <span
          className={clsx('h-1.5 w-1.5 rounded-full shrink-0', dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
