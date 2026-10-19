'use client';

import { ArrowRightIcon, CreditCardIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils';

interface EarningsTrendCardProps {
  payments: any[];
  liveRate: number;
  onViewAll: () => void;
}

export function EarningsTrendCard({ payments, liveRate, onViewAll }: EarningsTrendCardProps) {
  const recentPayments = payments.slice(0, 4);

  return (
    <Card variant="elevated" className="p-6 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-display-xs font-bold text-foreground">Earnings trend</h3>
            <p className="text-caption text-muted-foreground mt-0.5">
              Last {recentPayments.length || 7} payments • NGN value
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-caption font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col divide-y divide-border/40">
          {recentPayments.length > 0 ? (
            recentPayments.map((p: any) => {
              const amountUsd = parseFloat(p.amount) || 0;
              const amountNgn = amountUsd * (p.fxRate || liveRate);
              const isCompleted = p.status === 'COMPLETED' || p.status === 'PAID';

              return (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-caption font-bold text-foreground">
                        {p.note || 'Payroll Settlement'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.createdAt ? formatDate(p.createdAt) : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
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
            })
          ) : (
            <div className="py-8 text-center text-caption text-muted-foreground">
              No recent payment settlements yet.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
