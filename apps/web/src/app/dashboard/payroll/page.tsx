'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  AppStrings,
  CreditCardIcon,
  DownloadIcon,
  ZapIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency, formatDate } from '@/utils';
import { DisbursePaymentModal } from './_components/DisbursePaymentModal';
import { BatchPayrollModal } from './_components/BatchPayrollModal';

export default function PayrollPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

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

  const exportCsv = () => {
    if (payments.length === 0) return;
    const headers = ['Date', 'Worker', 'Amount', 'Fee', 'Total', 'Status', 'Reference'];
    const rows = payments.map((p: any) => [
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
          <Button variant="outline" onClick={exportCsv} disabled={payments.length === 0}>
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

      <Card variant="elevated" className="overflow-x-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-label-sm text-muted-foreground">
              <th className="p-4">Date</th>
              <th className="p-4">Contractor</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Fee (1%)</th>
              <th className="p-4">Total Charged</th>
              <th className="p-4">Status</th>
              <th className="p-4">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-body-md text-muted-foreground">
                  No payroll payments disbursed yet.
                </td>
              </tr>
            ) : (
              payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-body-sm text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="p-4 text-label-md font-semibold text-foreground">
                    {p.worker?.name || 'Worker'}
                  </td>
                  <td className="p-4 text-body-sm font-semibold text-foreground">
                    {formatCurrency(p.amount, p.currency)}
                  </td>
                  <td className="p-4 text-body-sm text-muted-foreground">
                    {formatCurrency(p.feeAmount, p.currency)}
                  </td>
                  <td className="p-4 text-body-sm font-bold text-foreground">
                    {formatCurrency(p.totalCharged, p.currency)}
                  </td>
                  <td className="p-4">
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold',
                        p.status === 'PAID' && 'bg-success/15 text-success',
                        p.status === 'SUBMITTED' && 'bg-brand-emerald/15 text-brand-emerald',
                        p.status === 'PENDING' && 'bg-warning/15 text-warning',
                        p.status === 'FAILED' && 'bg-destructive/15 text-destructive',
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-caption font-mono text-muted-foreground truncate max-w-[140px]">
                    {p.providerReference || p.idempotencyKey}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

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
