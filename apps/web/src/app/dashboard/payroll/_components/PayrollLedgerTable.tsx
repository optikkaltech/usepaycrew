'use client';

import clsx from 'clsx';
import { CreditCardIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils';

interface PayrollLedgerTableProps {
  payments: any[];
  onDisburseSingle: () => void;
}

export function PayrollLedgerTable({ payments, onDisburseSingle }: PayrollLedgerTableProps) {
  if (payments.length === 0) {
    return (
      <Card variant="elevated" className="p-8">
        <EmptyState
          icon={CreditCardIcon}
          title="No payroll records found"
          description="No disbursements match your current filter. Initiate a payroll run or single payment to see transactions here."
          actionLabel="Disburse Payment"
          onAction={onDisburseSingle}
        />
      </Card>
    );
  }

  return (
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
          {payments.map((p: any) => {
            const badgeVariant =
              p.status === 'PAID'
                ? 'success'
                : p.status === 'SUBMITTED'
                ? 'info'
                : p.status === 'FAILED'
                ? 'destructive'
                : 'warning';

            return (
              <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-body-sm text-muted-foreground">
                  {formatDate(p.createdAt)}
                </td>
                <td className="p-4 text-label-md font-semibold text-foreground">
                  {p.worker?.name || 'Contractor'}
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
                  <Badge variant={badgeVariant} withDot>
                    {p.status}
                  </Badge>
                </td>
                <td className="p-4 text-caption font-mono text-muted-foreground truncate max-w-[140px]">
                  {p.providerReference || p.idempotencyKey}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
