'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStrings, CheckIcon, XIcon, ShieldCheckIcon } from '@/assets';
import { Card, Button, Badge } from '@/components/ui';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatDate, normalizeError } from '@/utils';
import { KycStatus } from '@paycrew/shared-types';

interface KycQueueTableProps {
  queue: any[];
  isLoading: boolean;
}

export function KycQueueTable({ queue, isLoading }: KycQueueTableProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async ({ checkId, status }: { checkId: string; status: KycStatus }) => {
      return http.post(`/admin/kyc-queue/${checkId}/review`, { status });
    },
    onSuccess: (_, vars) => {
      toast.success(
        vars.status === KycStatus.APPROVED
          ? AppStrings.admin.reviewApproved
          : AppStrings.admin.reviewRejected,
      );
      queryClient.invalidateQueries({ queryKey: ['adminKycQueue'] });
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (isLoading) {
    return (
      <Card variant="elevated" className="p-8 text-center border-border">
        <p className="text-body-sm text-muted-foreground">Loading KYC review queue...</p>
      </Card>
    );
  }

  if (queue.length === 0) {
    return (
      <Card variant="elevated" className="p-12 text-center border-border flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald mb-3">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
        <p className="text-label-lg font-bold text-foreground">KYC Queue Clear</p>
        <p className="text-body-xs text-muted-foreground mt-1">
          No pending or manual review identity checks at this time.
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
              <th className="py-3 px-4 font-semibold">Contractor</th>
              <th className="py-3 px-4 font-semibold">Company</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Identifier</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                <td className="py-3.5 px-4 font-medium text-foreground">
                  <div>{item.worker?.name || 'Unknown'}</div>
                  <div className="text-caption text-muted-foreground">{item.worker?.email}</div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {item.worker?.company?.name || 'PayCrew'}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  {item.checkType}
                </td>
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {item.maskedIdentifier || '••••••••'}
                </td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      item.status === 'APPROVED'
                        ? 'success'
                        : item.status === 'FAILED'
                        ? 'destructive'
                        : 'warning'
                    }
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        reviewMutation.mutate({
                          checkId: item.id,
                          status: KycStatus.APPROVED,
                        })
                      }
                      isLoading={reviewMutation.isPending}
                      className="min-h-[36px] bg-brand-emerald hover:bg-brand-emerald/90 text-white"
                    >
                      <CheckIcon className="h-3.5 w-3.5 mr-1" />
                      {AppStrings.admin.approve}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        reviewMutation.mutate({
                          checkId: item.id,
                          status: KycStatus.FAILED,
                        })
                      }
                      isLoading={reviewMutation.isPending}
                      className="min-h-[36px] text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <XIcon className="h-3.5 w-3.5 mr-1" />
                      {AppStrings.admin.reject}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
