'use client';

import { CheckCircleIcon, ArrowRightIcon, ShieldCheckIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface OnboardCompleteStepProps {
  workerName: string;
  companyName: string;
  onGoToDashboard: () => void;
  isLoading?: boolean;
}

export function OnboardCompleteStep({
  workerName,
  companyName,
  onGoToDashboard,
  isLoading = false,
}: OnboardCompleteStepProps) {
  return (
    <Card variant="elevated" className="flex flex-col items-center text-center p-8 border-border">
      <div className="relative mb-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black shadow-sm dark:shadow-[0_0_24px_rgba(57,255,20,0.4)] animate-in zoom-in-75">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
      </div>

      <h2 className="text-display-sm font-extrabold text-foreground">
        You&apos;re All Set, {workerName}!
      </h2>

      <p className="mt-2 max-w-md text-body-sm text-muted-foreground">
        Your contractor profile and payment rails with{' '}
        <span className="font-semibold text-foreground">{companyName}</span> are now active.
      </p>

      <div className="my-6 w-full max-w-sm rounded-xl border border-border bg-secondary/40 p-4 text-left divide-y divide-border/60">
        <div className="flex items-center justify-between py-2 text-body-xs">
          <span className="text-muted-foreground">Contract Agreement</span>
          <span className="font-semibold text-success flex items-center gap-1">
            <ShieldCheckIcon className="h-3.5 w-3.5" /> Executed
          </span>
        </div>
        <div className="flex items-center justify-between py-2 text-body-xs">
          <span className="text-muted-foreground">Settlement Currency</span>
          <span className="font-semibold text-foreground">USDT / NGN</span>
        </div>
        <div className="flex items-center justify-between py-2 text-body-xs">
          <span className="text-muted-foreground">Compliance State</span>
          <span className="font-semibold text-brand-emerald">Ready for Payroll</span>
        </div>
      </div>

      <Button
        size="lg"
        isLoading={isLoading}
        onClick={onGoToDashboard}
        className="w-full max-w-sm min-h-[44px]"
      >
        {isLoading ? 'Opening Dashboard...' : 'Access Contractor Dashboard'}
        {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
      </Button>
    </Card>
  );
}
