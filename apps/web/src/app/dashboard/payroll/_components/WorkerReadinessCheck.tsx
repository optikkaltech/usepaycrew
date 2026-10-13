'use client';

import { AppStrings, CheckCircleIcon, ShieldAlertIcon } from '@/assets';
import { Card } from '@/components/ui/Card';

interface WorkerReadinessCheckProps {
  worker?: any;
}

export function WorkerReadinessCheck({ worker }: WorkerReadinessCheckProps) {
  if (!worker) return null;

  const isContractSigned = worker.status !== 'INVITED';
  const isKycVerified = worker.status === 'ACTIVE' || worker.status === 'VERIFIED';
  const isReady = isContractSigned && isKycVerified;

  if (isReady) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-label-sm text-success font-medium">
        <CheckCircleIcon className="h-4 w-4 shrink-0" />
        <span>Contractor verified &amp; ready for instant disbursement</span>
      </div>
    );
  }

  return (
    <Card className="border-warning/40 bg-warning/5 p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-warning">
        <ShieldAlertIcon className="h-4 w-4 shrink-0" />
        <span className="text-label-sm font-bold">{AppStrings.checkers.workerNotReady}</span>
      </div>

      <ul className="text-caption text-muted-foreground flex flex-col gap-1 list-disc list-inside">
        {!isContractSigned && <li>{AppStrings.checkers.contractUnsigned}</li>}
        {!isKycVerified && <li>{AppStrings.checkers.kycPending}</li>}
      </ul>
    </Card>
  );
}
