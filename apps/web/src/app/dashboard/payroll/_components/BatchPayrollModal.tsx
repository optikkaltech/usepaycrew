'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppStrings, XIcon, ShieldCheckIcon, CheckCircleIcon, ZapIcon, WalletIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';
import { Currency } from '@paycrew/shared-types';
import { TreasuryBalanceAlert } from './TreasuryBalanceAlert';
import { FundingModal } from '../../_components/FundingModal';

interface BatchPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workers: any[];
  rate?: number;
}

export function BatchPayrollModal({ isOpen, onClose, onSuccess, workers, rate = 1540 }: BatchPayrollModalProps) {
  const toast = useToast();
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readyWorkers = useMemo(() => workers.filter((w) => w.status !== 'INVITED'), [workers]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize selected IDs when readyWorkers change
  useMemo(() => {
    setSelectedIds(readyWorkers.map((w) => w.id));
  }, [readyWorkers]);

  const { data: balanceData } = useQuery({
    queryKey: ['companyBalance'],
    queryFn: () => http.get('/ledger/company-balance?currency=USD'),
    enabled: isOpen,
  });

  const { data: fundingInfo } = useQuery({
    queryKey: ['fundingInfo'],
    queryFn: () => http.get('/companies/funding-info'),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const availableBalance = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const selectedWorkers = readyWorkers.filter((w) => selectedIds.includes(w.id));
  const subtotal = selectedWorkers.reduce((acc, w) => acc + parseFloat(w.payAmount || '0'), 0);
  const feeAmount = Math.max(subtotal * 0.01, selectedWorkers.length * 0.5);
  const totalCharged = subtotal + feeAmount;
  const isInsufficient = availableBalance < totalCharged;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleDisburseAll = async () => {
    if (selectedWorkers.length === 0) return;
    if (isInsufficient) {
      toast.error('Insufficient treasury balance. Please fund your account.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        currency: Currency.USD,
        payments: selectedWorkers.map((w) => ({
          workerId: w.id,
          amount: parseFloat(w.payAmount).toFixed(2),
          note: `Batch Payroll Disburse (${new Date().toLocaleDateString()})`,
        })),
      };

      await http.post('/payments/batch', payload);
      toast.success(AppStrings.payments.batchSuccess);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-display-sm text-foreground">{AppStrings.payments.batchTitle}</h2>
            <p className="text-body-xs text-muted-foreground mt-0.5">{AppStrings.payments.batchSubtitle}</p>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-secondary/40 rounded-xl border border-border text-body-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <WalletIcon className="h-4 w-4 text-primary" />
              <span>USDT Treasury: <strong>{formatCurrency(availableBalance, 'USD')}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-emerald font-semibold">
              <ZapIcon className="h-3.5 w-3.5" />
              <span>1 USDT ≈ ₦{rate.toLocaleString()} (Quidax OTC)</span>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-xl border border-border divide-y divide-border">
            {readyWorkers.length === 0 ? (
              <p className="p-6 text-center text-body-sm text-muted-foreground">{AppStrings.payments.noReadyWorkers}</p>
            ) : (
              readyWorkers.map((w) => {
                const amountUsdt = parseFloat(w.payAmount || '0');
                const isChecked = selectedIds.includes(w.id);
                return (
                  <label key={w.id} className="flex items-center justify-between p-3.5 hover:bg-secondary/30 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(w.id)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="text-label-md font-semibold text-foreground">{w.name}</p>
                        <p className="text-caption text-muted-foreground">{w.role || 'Contractor'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-label-md font-bold text-foreground">{formatCurrency(amountUsdt, 'USD')}</span>
                      <span className="text-caption text-muted-foreground">≈ ₦{(amountUsdt * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-full ${w.autoCashoutEnabled ? 'bg-success/15 text-success' : 'bg-primary/15 text-primary'}`}>
                        {w.autoCashoutEnabled ? '🏦 Bank Cashout' : '💼 Holding USDT'}
                      </span>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <Card className="bg-secondary/30 p-4">
            <div className="flex items-center justify-between text-body-xs text-muted-foreground py-0.5">
              <span>Selected ({selectedWorkers.length} contractors):</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between text-body-xs text-muted-foreground py-0.5">
              <span>Processing Fee (1.0%):</span>
              <span className="font-semibold text-foreground">{formatCurrency(feeAmount, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between text-label-md font-bold text-foreground border-t border-border pt-2 mt-1">
              <span>Total Disburse Debit:</span>
              <span className="text-primary">{formatCurrency(totalCharged, 'USD')}</span>
            </div>
          </Card>

          <TreasuryBalanceAlert availableBalance={availableBalance} totalCharged={totalCharged} onOpenFundModal={() => setFundModalOpen(true)} />

          <div className="mt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>{AppStrings.common.cancel}</Button>
            <Button onClick={handleDisburseAll} isLoading={isSubmitting} disabled={selectedWorkers.length === 0 || isInsufficient}>
              <CheckCircleIcon className="mr-1.5 h-4 w-4" />
              {AppStrings.payments.disburseBatch} ({selectedWorkers.length})
            </Button>
          </div>
        </div>

        <FundingModal isOpen={fundModalOpen} onClose={() => setFundModalOpen(false)} fundingInfo={fundingInfo} />
      </div>
    </div>
  );
}
