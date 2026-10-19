'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStrings, RefreshCwIcon, ArrowDownLeftIcon } from '@/assets';
import { Card, Button, Badge } from '@/components/ui';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatDate, formatCurrency, normalizeError } from '@/utils';

interface TransactionMonitorTableProps {
  transactions: any[];
  isLoading: boolean;
}

export function TransactionMonitorTable({ transactions, isLoading }: TransactionMonitorTableProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const retryMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return http.post('/admin/transactions/retry', { paymentId });
    },
    onSuccess: () => {
      toast.success(AppStrings.admin.retrySuccess);
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (isLoading) {
    return (
      <Card variant="elevated" className="p-8 text-center border-border">
        <p className="text-body-sm text-muted-foreground">Loading transaction monitor...</p>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card variant="elevated" className="p-12 text-center border-border flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
          <ArrowDownLeftIcon className="h-6 w-6" />
        </div>
        <p className="text-label-lg font-bold text-foreground">All Payouts In Good Standing</p>
        <p className="text-body-xs text-muted-foreground mt-1">
          No pending or failed disbursements currently requiring administrative intervention.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-xs">
          <thead className="bg-secondary/40 text-muted-foreground uppercase text-caption border-b border-border">
            <tr>
              <th className="py-3 px-4 font-semibold">Payment Ref</th>
              <th className="py-3 px-4 font-semibold">Company</th>
              <th className="py-3 px-4 font-semibold">Recipient</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Failure Reason</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  {tx.providerReference || tx.idempotencyKey?.slice(0, 16) || tx.id.slice(0, 8)}
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {tx.company?.name || 'Company'}
                </td>
                <td className="py-3.5 px-4 font-medium text-foreground">
                  <div>{tx.worker?.name || 'Worker'}</div>
                  <div className="text-caption text-muted-foreground">{tx.worker?.email}</div>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-foreground">
                  {formatCurrency(tx.amount, tx.currency || 'USD')}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={tx.status === 'PAID' ? 'success' : tx.status === 'FAILED' ? 'destructive' : 'warning'}>
                    {tx.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-destructive text-caption max-w-[200px] truncate">
                  {tx.failureReason || '—'}
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {tx.status === 'FAILED' && (
                    <Button
                      size="sm"
                      onClick={() => retryMutation.mutate(tx.id)}
                      isLoading={retryMutation.isPending}
                      className="min-h-[36px]"
                    >
                      <RefreshCwIcon className="h-3.5 w-3.5 mr-1" />
                      {AppStrings.admin.retry}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
