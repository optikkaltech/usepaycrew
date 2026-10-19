'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  UsersIcon,
  ClockIcon,
  TrendingUpIcon,
  ZapIcon,
  AppStrings,
} from '@/assets';
import { formatCurrency } from '@/utils';

interface DashboardMetricsGridProps {
  workersCount: number;
  pendingPayoutsCount: number;
  totalDisbursedUsd: number;
}

export function DashboardMetricsGrid({
  workersCount,
  pendingPayoutsCount,
  totalDisbursedUsd,
}: DashboardMetricsGridProps) {
  const metrics = [
    {
      title: AppStrings.dashboard.activeWorkers,
      value: String(workersCount),
      subtitle: 'Enrolled across corridors',
      icon: UsersIcon,
      color: 'text-foreground bg-secondary',
      href: '/dashboard/workers',
    },
    {
      title: AppStrings.dashboard.pendingPayouts,
      value: String(pendingPayoutsCount),
      subtitle: 'Queued for batch execution',
      icon: ClockIcon,
      color: 'text-foreground bg-secondary',
      href: '/dashboard/payroll',
    },
    {
      title: AppStrings.dashboard.totalDisbursed,
      value: formatCurrency(totalDisbursedUsd, 'USD'),
      subtitle: 'All-time settlement volume',
      icon: TrendingUpIcon,
      color: 'text-foreground bg-secondary',
      href: '/dashboard/payroll',
    },
    {
      title: 'Settlement Speed',
      value: '< 60s',
      subtitle: 'Instant off-ramp network SLA',
      icon: ZapIcon,
      color: 'text-foreground bg-secondary',
      href: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        const content = (
          <Card
            key={item.title}
            className="flex flex-col justify-between p-4 bg-card hover:border-foreground/20 transition-all shadow-xs h-full"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-caption text-muted-foreground font-medium line-clamp-1">
                {item.title}
              </span>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-display-xs font-bold text-foreground tracking-tight">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                {item.subtitle}
              </p>
            </div>
          </Card>
        );

        if (item.href) {
          return (
            <Link key={item.title} href={item.href} className="block group">
              {content}
            </Link>
          );
        }

        return <div key={item.title}>{content}</div>;
      })}
    </div>
  );
}
