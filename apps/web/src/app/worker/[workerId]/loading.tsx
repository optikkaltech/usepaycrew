import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';

export default function WorkerPortalLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Balance Card Skeleton */}
      <SkeletonCard className="h-44 w-full rounded-2xl" />

      {/* KYC / Bank Rails Card Skeleton */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      {/* Payouts Table Skeleton */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <SkeletonTable rows={4} cols={3} />
      </div>
    </div>
  );
}
