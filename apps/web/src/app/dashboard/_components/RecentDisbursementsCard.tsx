'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  UsersIcon,
  WalletIcon,
} from '@/assets';
import { formatCurrency, formatDate } from '@/utils';
import { DashboardPaymentItem } from './dashboard.types';

interface RecentDisbursementsCardProps {
  payments: DashboardPaymentItem[];
  onOpenFunding: () => void;
}

export function RecentDisbursementsCard({
  payments,
  onOpenFunding,
}: RecentDisbursementsCardProps) {
  const recentPayments = payments.slice(0, 5);

  return (
    <Card className="flex flex-col bg-card/90 border-border p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h2 className="text-label-lg font-bold text-foreground">
            Recent Payroll & Disbursements
          </h2>
          <p className="text-caption text-muted-foreground">
            Direct bank off-ramp and multi-chain settlement history
          </p>
        </div>
        <Link
          href="/dashboard/payroll"
          className="inline-flex items-center gap-1 text-caption font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>All Runs</span>
          <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Content Area */}
      {recentPayments.length > 0 ? (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-caption font-semibold text-muted-foreground">
                <th className="py-2.5 px-2">Recipient</th>
                <th className="py-2.5 px-2">Corridor</th>
                <th className="py-2.5 px-2">Amount</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 px-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-caption">
              {recentPayments.map((p) => {
                const isCompleted = p.status === 'COMPLETED' || p.status === 'PAID';
                return (
                  <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-foreground">
                        {p.worker?.name || 'Contractor'}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                        {p.worker?.email || p.note || 'Payroll payout'}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        {p.currency} → {p.worker?.payoutCurrency || 'NGN'}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-semibold text-foreground">
                      {formatCurrency(parseFloat(p.amount) || 0, (p.currency as any) || 'USD')}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon className="h-2.5 w-2.5" />
                        ) : (
                          <ClockIcon className="h-2.5 w-2.5" />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-muted-foreground">
                      {p.createdAt ? formatDate(p.createdAt) : 'Just now'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Operational Readiness Pipeline when 0 payments */
        <div className="flex flex-col gap-4 py-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCardIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-label-sm font-bold text-foreground">
                Treasury Ready for Instant Payroll Execution
              </span>
            </div>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Disburse salaries and contractor invoices directly into local bank accounts in Nigeria, Kenya, Ghana, or stablecoin wallets within seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard/workers"
              className="flex flex-col justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-caption font-bold text-foreground mb-1">
                  <span>1. Enrol Team</span>
                  <UsersIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Add contractors, local banks, or crypto payout rails.
                </p>
              </div>
              <span className="mt-2 text-caption font-semibold text-foreground inline-flex items-center gap-1 group-hover:text-muted-foreground transition-colors">
                Manage Workers <ArrowRightIcon className="h-3 w-3" />
              </span>
            </Link>

            <button
              type="button"
              onClick={onOpenFunding}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all text-left cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between text-caption font-bold text-foreground mb-1">
                  <span>2. Fund Treasury</span>
                  <WalletIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Deposit USDT/USDC via TRON, Base, or Polygon.
                </p>
              </div>
              <span className="mt-2 text-caption font-semibold text-foreground inline-flex items-center gap-1 group-hover:text-muted-foreground transition-colors">
                Deposit Balance <PlusIcon className="h-3 w-3" />
              </span>
            </button>

            <Link
              href="/dashboard/payroll"
              className="flex flex-col justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-caption font-bold text-foreground mb-1">
                  <span>3. Run Payroll</span>
                  <CreditCardIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Execute 1-click single or batch off-ramp payouts.
                </p>
              </div>
              <span className="mt-2 text-caption font-semibold text-foreground inline-flex items-center gap-1 group-hover:text-muted-foreground transition-colors">
                Start Run <ArrowRightIcon className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
