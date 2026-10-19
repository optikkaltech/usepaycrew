'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AppStrings, RefreshCwIcon, HomeIcon } from '@/assets';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error('Unhandled PayCrew UI Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive text-display-xl font-black">
        !
      </div>

      <h1 className="text-display-md font-extrabold text-foreground sm:text-display-lg">
        Something went wrong
      </h1>

      <p className="mt-3 max-w-md text-body-md text-muted-foreground">
        An error occurred while loading this view. Your treasury and funds remain completely safe on-chain.
      </p>

      {error?.message && (
        <pre className="mt-4 max-w-lg overflow-x-auto rounded-lg bg-secondary/60 p-3 text-caption font-mono text-muted-foreground border border-border">
          {error.message}
        </pre>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button size="lg" onClick={() => reset()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            <HomeIcon className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-caption text-muted-foreground">
        {AppStrings.appName} — Enterprise Infrastructure
      </div>
    </div>
  );
}
