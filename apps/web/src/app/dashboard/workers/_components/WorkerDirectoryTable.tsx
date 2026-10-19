'use client';

import clsx from 'clsx';
import {
  AppStrings,
  CopyIcon,
  CheckIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MaskedField } from '@/components/ui/MaskedField';
import { formatCurrency } from '@/utils';
import { usePrivacyStore } from '@/store';

interface WorkerDirectoryTableProps {
  workers: any[];
  onCopyInvite: (token: string, workerId: string) => void;
  copiedId: string | null;
  onAddWorker: () => void;
  onEditWorker: (worker: any) => void;
  onDeleteWorker: (worker: any) => void;
}

export function WorkerDirectoryTable({
  workers,
  onCopyInvite,
  copiedId,
  onAddWorker,
  onEditWorker,
  onDeleteWorker,
}: WorkerDirectoryTableProps) {
  const { isPrivacyMode } = usePrivacyStore();

  if (workers.length === 0) {
    return (
      <Card variant="elevated" className="p-8">
        <EmptyState
          icon={UsersIcon}
          title="No contractors found"
          description="No contractors match your selected filter criteria. Try clearing the filter or adding a new team member."
          actionLabel={AppStrings.dashboard.addWorker}
          onAction={onAddWorker}
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-x-auto p-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-secondary/50 text-label-sm text-muted-foreground">
            <th className="p-4">{AppStrings.workers.name}</th>
            <th className="p-4">{AppStrings.workers.role}</th>
            <th className="p-4">{AppStrings.workers.payAmount}</th>
            <th className="p-4">Compliance &amp; KYC</th>
            <th className="p-4">Readiness</th>
            <th className="p-4 text-right">{AppStrings.workers.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {workers.map((worker: any) => {
            const isContractSigned = worker.status !== 'INVITED';
            const isKycVerified = worker.status === 'ACTIVE' || worker.status === 'VERIFIED';
            const isReady = isContractSigned && isKycVerified;

            return (
              <tr key={worker.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <p className="text-label-md font-semibold text-foreground">{worker.name}</p>
                  <MaskedField
                    value={worker.email}
                    maskedValue={worker.maskedEmail}
                    type="email"
                    allowReveal={true}
                    allowCopy={true}
                    className="text-muted-foreground"
                  />
                </td>
                <td className="p-4 text-body-sm text-foreground">{worker.role}</td>
                <td className="p-4 text-body-sm font-semibold text-foreground">
                  <span className={clsx(isPrivacyMode && 'select-none blur-sm transition-all')}>
                    {formatCurrency(worker.payAmount, worker.payCurrency)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 text-caption font-semibold',
                        isContractSigned ? 'text-success' : 'text-warning'
                      )}
                    >
                      {isContractSigned ? '✓ Contract Signed' : '⏳ Awaiting Signature'}
                    </span>
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 text-caption',
                        isKycVerified ? 'text-brand-emerald font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      {isKycVerified ? '✓ Identity Verified' : '○ Identity Pending'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={isReady ? 'success' : 'warning'} withDot>
                    {isReady ? 'Ready for Pay' : 'Setup Incomplete'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {worker.inviteToken && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCopyInvite(worker.inviteToken, worker.id)}
                        title="Copy Invitation Link"
                      >
                        {copiedId === worker.id ? (
                          <CheckIcon className="h-4 w-4 text-success" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                        <span className="ml-1.5 hidden sm:inline">Copy Invite</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditWorker(worker)}
                      className="h-9 w-9 p-0 hover:bg-secondary text-muted-foreground hover:text-foreground"
                      title="Edit contractor"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteWorker(worker)}
                      className="h-9 w-9 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                      title="Remove contractor"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
