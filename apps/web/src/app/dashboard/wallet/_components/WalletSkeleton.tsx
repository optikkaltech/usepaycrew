'use client';

import { Card } from '@/components/ui/Card';

export function WalletSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary/80 rounded-lg" />
          <div className="h-4 w-72 bg-secondary/60 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-secondary/70 rounded-xl" />
      </div>

      {/* Hero Balance Card Skeleton */}
      <Card variant="elevated" className="p-6 sm:p-8 border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-3">
          <div className="h-3.5 w-28 bg-secondary/80 rounded" />
          <div className="flex items-baseline gap-3">
            <div className="h-10 w-52 bg-secondary rounded-xl" />
            <div className="h-6 w-24 bg-secondary/60 rounded-lg" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-5 w-20 bg-secondary/70 rounded-full" />
            <div className="h-5 w-32 bg-secondary/60 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-36 bg-secondary/80 rounded-xl" />
          <div className="h-11 w-28 bg-secondary/60 rounded-xl" />
        </div>
      </Card>

      {/* 3-Column Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* Deposit Address Skeleton */}
        <Card variant="elevated" className="lg:col-span-5 p-6 border-border flex flex-col justify-between gap-5 min-h-[460px]">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-secondary rounded-lg" />
            <div className="h-4 w-56 bg-secondary/60 rounded" />
          </div>
          <div className="h-52 w-full bg-secondary/40 rounded-2xl flex items-center justify-center">
            <div className="h-44 w-44 bg-secondary/70 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-11 w-full bg-secondary/60 rounded-xl" />
            <div className="h-4 w-48 bg-secondary/50 rounded" />
          </div>
        </Card>

        {/* Metrics Cards Skeleton */}
        <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
          <Card variant="elevated" className="p-5 border-border h-32 flex flex-col justify-between">
            <div className="h-3 w-24 bg-secondary/80 rounded" />
            <div className="h-7 w-32 bg-secondary rounded-lg" />
            <div className="h-3.5 w-20 bg-secondary/60 rounded" />
          </Card>
          <Card variant="elevated" className="p-5 border-border h-32 flex flex-col justify-between">
            <div className="h-3 w-20 bg-secondary/80 rounded" />
            <div className="h-7 w-36 bg-secondary rounded-lg" />
            <div className="h-3.5 w-24 bg-secondary/60 rounded" />
          </Card>
          <Card variant="elevated" className="p-5 border-border h-32 flex flex-col justify-between">
            <div className="h-3 w-28 bg-secondary/80 rounded" />
            <div className="h-7 w-16 bg-secondary rounded-lg" />
            <div className="h-3.5 w-36 bg-secondary/60 rounded" />
          </Card>
        </div>

        {/* Funding History Skeleton */}
        <Card variant="elevated" className="md:col-span-2 lg:col-span-4 p-6 border-border flex flex-col gap-5 min-h-[460px]">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-secondary rounded-lg" />
            <div className="h-4 w-48 bg-secondary/60 rounded" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary/70 rounded-xl shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 bg-secondary/80 rounded" />
                    <div className="h-3 w-20 bg-secondary/50 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-secondary/60 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
