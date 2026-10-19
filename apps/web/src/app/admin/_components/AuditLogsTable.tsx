'use client';

import { Card } from '@/components/ui';
import { formatDate } from '@/utils';
import { DatabaseIcon } from '@/assets';

interface AuditLogsTableProps {
  logs: any[];
  isLoading: boolean;
}

export function AuditLogsTable({ logs, isLoading }: AuditLogsTableProps) {
  if (isLoading) {
    return (
      <Card variant="elevated" className="p-8 text-center border-border">
        <p className="text-body-sm text-muted-foreground">Loading compliance audit trail...</p>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card variant="elevated" className="p-12 text-center border-border flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-3">
          <DatabaseIcon className="h-6 w-6" />
        </div>
        <p className="text-label-lg font-bold text-foreground">Audit Log Initialized</p>
        <p className="text-body-xs text-muted-foreground mt-1">
          System events and monetary operations will automatically record here.
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
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Actor</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Entity</th>
              <th className="py-3 px-4 font-semibold">Entity ID</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </td>
                <td className="py-3 px-4 font-medium text-foreground">
                  {log.actorEmail || log.actorId || 'System'}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-brand-emerald">
                  {log.action}
                </td>
                <td className="py-3 px-4 text-muted-foreground font-semibold">
                  {log.entity}
                </td>
                <td className="py-3 px-4 font-mono text-caption text-muted-foreground">
                  {log.entityId ? `${log.entityId.slice(0, 12)}...` : '—'}
                </td>
                <td className="py-3 px-4 font-mono text-caption text-muted-foreground">
                  {log.ip || '127.0.0.1'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
