'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  CreditCardIcon,
  DownloadIcon,
  ZapIcon,
  SearchIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { http } from '@/services';
import { formatDate } from '@/utils';
import { DisbursePaymentModal } from './_components/DisbursePaymentModal';
import { BatchPayrollModal } from './_components/BatchPayrollModal';
import { PayrollLedgerTable } from './_components/PayrollLedgerTable';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Payments' },
  { id: 'PAID', label: 'Completed' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'FAILED', label: 'Failed' },
];

export default function PayrollPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: payments = [], refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: () => http.get('/payments'),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const { data: rateData } = useQuery({
    queryKey: ['marketRate'],
    queryFn: () => http.get('/payments/rate?pair=USDT_NGN'),
    refetchInterval: 30000,
  });

  const rate = rateData?.rate || 1540;

  const filteredPayments = useMemo(() => {
    return payments.filter((p: any) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.worker?.name || '').toLowerCase().includes(q);
        const matchRef = (p.providerReference || p.idempotencyKey || '').toLowerCase().includes(q);
        return matchName || matchRef;
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  const exportCsv = () => {
    if (filteredPayments.length === 0) return;
    const headers = ['Date', 'Worker', 'Amount', 'Fee', 'Total', 'Status', 'Reference'];
    const rows = filteredPayments.map((p: any) => [
      formatDate(p.createdAt),
      p.worker?.name || p.workerId,
      p.amount,
      p.feeAmount,
      p.totalCharged,
      p.status,
      p.providerReference || p.idempotencyKey,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `paycrew_payroll_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.payments.title}</h1>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1 text-caption font-semibold text-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>1 USDT ≈ ₦{rate.toLocaleString()}</span>
            </div>
          </div>
          <p className="mt-1 text-body-sm text-muted-foreground">Disburse contractor payments and manage treasury settlements</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={exportCsv} disabled={filteredPayments.length === 0}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            {AppStrings.payments.exportCsv}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            <CreditCardIcon className="mr-2 h-4 w-4" />
            {AppStrings.payments.paySingle}
          </Button>
          <Button onClick={() => setBatchModalOpen(true)}>
            <ZapIcon className="mr-2 h-4 w-4" />
            {AppStrings.payments.runPayroll}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={STATUS_TABS}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search contractor or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>

      <PayrollLedgerTable
        payments={filteredPayments}
        onDisburseSingle={() => setModalOpen(true)}
      />

      <DisbursePaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
        workers={workers}
      />

      <BatchPayrollModal
        isOpen={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        onSuccess={() => refetch()}
        workers={workers}
        rate={rate}
      />
    </div>
  );
}
