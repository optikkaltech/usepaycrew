'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreditCardIcon, CheckCircleIcon, ClockIcon } from '@/assets';
import { http } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

interface WorkerPaymentsListProps {
  workerId: string;
  liveRate: number;
}

export function WorkerPaymentsList({ workerId, liveRate }: WorkerPaymentsListProps) {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['workerPayments', workerId],
    queryFn: () => http.get(`/payments?workerId=${workerId}`),
  });

  return (
    <Card className="flex flex-col gap-3 bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-label-md font-bold text-foreground">
            Received Payments & Earnings
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Payout history and local bank settlement records
          </p>
        </div>
        <span className="text-caption font-semibold text-muted-foreground">
          {payments.length} {payments.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2" aria-hidden="true">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : payments.length > 0 ? (
        <div className="divide-y divide-border/40">
          {payments.map((p: any) => {
            const amountUsd = parseFloat(p.amount) || 0;
            const amountNgn = amountUsd * (p.fxRate || liveRate);
            const isCompleted = p.status === 'COMPLETED' || p.status === 'PAID';

            return (
              <div
                key={p.id}
                className="flex items-center justify-between py-3 hover:bg-secondary/30 transition-colors rounded-lg px-1.5"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-caption font-semibold text-foreground truncate">
                      {p.note || 'Payroll Disbursement'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.createdAt ? formatDate(p.createdAt) : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-caption font-bold text-foreground">
                    +{formatCurrency(amountUsd, 'USD')}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ≈ {formatCurrency(amountNgn, 'NGN')}
                  </p>
                  <div className="mt-0.5">
                    <Badge variant={isCompleted ? 'success' : 'warning'} withDot>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CreditCardIcon}
          title="No payments received yet"
          description="When your employer executes a payroll run, your earnings and bank transfer receipts will appear here automatically."
          className="p-6 my-2 border-0 bg-transparent"
        />
      )}
    </Card>
  );
}
