import Link from 'next/link';
import { AppStrings, ArrowRightIcon, HomeIcon } from '@/assets';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald text-display-xl font-black shadow-[0_0_24px_rgba(6,214,160,0.2)]">
          404
        </div>
      </div>

      <h1 className="text-display-md font-extrabold text-foreground sm:text-display-lg">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-body-md text-muted-foreground">
        The payroll ledger, treasury route, or contractor profile you were looking for doesn&apos;t exist or has moved.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/dashboard">
          <Button size="lg">
            <HomeIcon className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">
            PayCrew Homepage
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-caption text-muted-foreground">
        {AppStrings.appName} — Enterprise Cross-Border Payroll &amp; Treasury
      </div>
    </div>
  );
}
