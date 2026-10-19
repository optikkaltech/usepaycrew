'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppStrings, ShieldIcon } from '@/assets';
import { Tabs } from '@/components/ui';
import { http } from '@/services';
import { KycQueueTable } from './_components/KycQueueTable';
import { TransactionMonitorTable } from './_components/TransactionMonitorTable';
import { AuditLogsTable } from './_components/AuditLogsTable';

const ADMIN_TABS = [
  { id: 'KYC', label: AppStrings.admin.kycQueueTab },
  { id: 'TRANSACTIONS', label: AppStrings.admin.transactionsTab },
  { id: 'AUDIT', label: AppStrings.admin.auditLogsTab },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('KYC');

  const { data: kycQueue = [], isLoading: isKycLoading } = useQuery({
    queryKey: ['adminKycQueue'],
    queryFn: () => http.get('/admin/kyc-queue'),
    enabled: activeTab === 'KYC',
  });

  const { data: transactions = [], isLoading: isTxLoading } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: () => http.get('/admin/transactions'),
    enabled: activeTab === 'TRANSACTIONS',
  });

  const { data: auditLogs = [], isLoading: isAuditLoading } = useQuery({
    queryKey: ['adminAuditLogs'],
    queryFn: () => http.get('/admin/audit-logs'),
    enabled: activeTab === 'AUDIT',
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-4 py-8">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-emerald/15 flex items-center justify-center text-brand-emerald">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.admin.title}</h1>
        </div>
        <p className="mt-1 text-body-sm text-muted-foreground">{AppStrings.admin.subtitle}</p>
      </div>

      <Tabs tabs={ADMIN_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'KYC' && (
        <KycQueueTable queue={kycQueue} isLoading={isKycLoading} />
      )}

      {activeTab === 'TRANSACTIONS' && (
        <TransactionMonitorTable transactions={transactions} isLoading={isTxLoading} />
      )}

      {activeTab === 'AUDIT' && (
        <AuditLogsTable logs={auditLogs} isLoading={isAuditLoading} />
      )}
    </div>
  );
}
