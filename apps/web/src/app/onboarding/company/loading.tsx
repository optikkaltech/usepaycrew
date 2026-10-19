import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function CompanyOnboardingLoading() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>

      {/* Stepper Skeleton */}
      <div className="grid grid-cols-4 gap-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      {/* Main Form Card Skeleton */}
      <SkeletonCard className="h-96 w-full rounded-2xl" />
    </div>
  );
}
