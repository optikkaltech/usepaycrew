'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  AppStrings,
  UserPlusIcon,
  CopyIcon,
  CheckIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency } from '@/utils';
import { useToast } from '@/hooks';
import { MaskedField } from '@/components/ui/MaskedField';
import { usePrivacyStore } from '@/store';
import { AddWorkerModal } from './_components/AddWorkerModal';

export default function WorkersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();
  const { isPrivacyMode } = usePrivacyStore();

  const { data: workers = [], refetch } = useQuery({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const copyInvite = (token: string, workerId: string) => {
    const inviteUrl = `${window.location.origin}/onboard/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(workerId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Onboarding link copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.workers.title}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">Manage remote staff, contracts and payouts</p>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          {AppStrings.dashboard.addWorker}
        </Button>
      </div>

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
            {workers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-md text-muted-foreground">
                  No contractors added yet. Click &apos;Add Worker&apos; to invite your first remote team member.
                </td>
              </tr>
            ) : (
              workers.map((worker: any) => {
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
                        <span className={clsx(
                          'inline-flex items-center gap-1 text-caption font-semibold',
                          isContractSigned ? 'text-success' : 'text-warning'
                        )}>
                          {isContractSigned ? '✓ Contract Signed' : '⏳ Awaiting Signature'}
                        </span>
                        <span className={clsx(
                          'inline-flex items-center gap-1 text-caption',
                          isKycVerified ? 'text-brand-emerald font-semibold' : 'text-muted-foreground'
                        )}>
                          {isKycVerified ? '✓ Prembly KYC Verified' : '○ KYC Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={clsx(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold',
                          isReady ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                        )}
                      >
                        {isReady ? 'Ready for Pay' : 'Setup Incomplete'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {worker.inviteToken && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyInvite(worker.inviteToken, worker.id)}
                        >
                          {copiedId === worker.id ? (
                            <CheckIcon className="h-4 w-4 text-success" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                          <span className="ml-1.5 hidden sm:inline">Copy Invite</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>


      <AddWorkerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
