'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { UsersIcon, ArrowRightIcon, UserPlusIcon } from '@/assets';
import { DashboardWorkerItem } from './dashboard.types';

interface ContractorSnapshotWidgetProps {
  workers: DashboardWorkerItem[];
}

export function ContractorSnapshotWidget({ workers }: ContractorSnapshotWidgetProps) {
  const topWorkers = workers.slice(0, 4);

  return (
    <Card className="flex flex-col gap-3 bg-card/90 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-label-md font-bold text-foreground">
            Contractors & Team
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {workers.length} active payroll {workers.length === 1 ? 'recipient' : 'recipients'}
          </p>
        </div>
        <Link
          href="/dashboard/workers"
          className="inline-flex items-center gap-1 text-caption font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Manage</span>
          <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {topWorkers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {topWorkers.map((w) => {
            const initial = (w.name || 'W').charAt(0).toUpperCase();
            return (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-foreground font-bold text-caption">
                    {initial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-caption font-semibold text-foreground truncate">
                      {w.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {w.role || w.country || 'Contractor'} • {w.payoutCurrency || 'NGN'}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/payroll?workerId=${w.id}`}
                  className="shrink-0 text-[11px] font-medium text-foreground hover:bg-secondary bg-secondary/80 px-2.5 py-1 rounded-md border border-border transition-colors"
                >
                  Pay
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-5 text-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-caption font-semibold text-foreground">
              No contractors added yet
            </p>
            <p className="text-[11px] text-muted-foreground">
              Invite global workers to disburse automated payroll.
            </p>
          </div>
          <Link
            href="/dashboard/workers"
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-1.5 text-caption font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <UserPlusIcon className="h-3.5 w-3.5" />
            Add First Worker
          </Link>
        </div>
      )}
    </Card>
  );
}
