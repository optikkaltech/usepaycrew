import React from 'react';
import clsx from 'clsx';
import { Card } from './Card';
import { TrendingUpIcon } from '@/assets';

export interface StatTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  secondaryValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function StatTile({
  title,
  value,
  subtitle,
  secondaryValue,
  icon: Icon,
  trend,
  onClick,
  className,
}: StatTileProps) {
  const content = (
    <Card
      className={clsx(
        'flex flex-col justify-between p-4 sm:p-5 bg-card border border-border shadow-xs transition-all h-full',
        onClick && 'hover:border-foreground/20 cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-caption text-muted-foreground font-medium line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-display-xs font-bold text-foreground tracking-tight">
            {value}
          </p>
          {secondaryValue && (
            <span className="text-caption font-semibold text-muted-foreground">
              {secondaryValue}
            </span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {trend && (
              <span
                className={clsx(
                  'inline-flex items-center gap-0.5 font-semibold',
                  trend.isPositive ? 'text-emerald-500' : 'text-destructive',
                )}
              >
                <TrendingUpIcon
                  className={clsx('h-3 w-3', !trend.isPositive && 'rotate-180')}
                />
                {trend.value}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );

  return onClick ? (
    <div onClick={onClick} role="button" tabIndex={0} className="h-full">
      {content}
    </div>
  ) : (
    content
  );
}
