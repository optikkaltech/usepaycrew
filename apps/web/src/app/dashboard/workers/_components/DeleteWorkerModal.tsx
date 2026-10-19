'use client';

import { useMutation } from '@tanstack/react-query';
import { AppStrings, TrashIcon, XIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { WorkerService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

interface DeleteWorkerModalProps {
  worker: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteWorkerModal({ worker, isOpen, onClose, onSuccess }: DeleteWorkerModalProps) {
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!worker?.id) throw new Error('Worker ID missing');
      return WorkerService.delete(worker.id);
    },
    onSuccess: () => {
      toast.success(AppStrings.workers.deleteSuccess);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-destructive font-semibold">
            <TrashIcon className="h-5 w-5" />
            <h2 className="text-display-sm text-destructive">{AppStrings.workers.deleteModalTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 flex flex-col gap-3">
          <p className="text-body-md text-foreground">
            Are you sure you want to remove <strong className="text-foreground">{worker.name}</strong> ({worker.role})?
          </p>
          <p className="text-body-sm text-muted-foreground">
            {AppStrings.workers.deleteConfirmMessage}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            {AppStrings.common.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            isLoading={deleteMutation.isPending}
          >
            {AppStrings.workers.deleteContractor}
          </Button>
        </div>
      </div>
    </div>
  );
}
