import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:w-64" />
          <Skeleton className="h-4 w-36 sm:w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Treasury Card Skeleton */}
      <SkeletonCard className="h-44 sm:h-48 w-full rounded-2xl" />

      {/* Metrics 4-Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SkeletonCard className="h-28 rounded-2xl" />
        <SkeletonCard className="h-28 rounded-2xl" />
        <SkeletonCard className="h-28 rounded-2xl" />
        <SkeletonCard className="h-28 rounded-2xl" />
      </div>

      {/* Recent Disbursements / Activity Skeleton */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        <SkeletonTable rows={5} cols={5} />
      </div>
    </div>
  );
}
