'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, XIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WorkerService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { Currency, PayFrequency } from '@paycrew/shared-types';

const workerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid work email'),
  role: z.string().min(2, 'Job role is required'),
  payAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  payCurrency: z.nativeEnum(Currency),
  payFrequency: z.nativeEnum(PayFrequency),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

import { useMutation } from '@tanstack/react-query';

export function AddWorkerModal({ isOpen, onClose, onSuccess }: AddWorkerModalProps) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      payCurrency: Currency.USD,
      payFrequency: PayFrequency.MONTHLY,
    },
  });

  const workerMutation = useMutation({
    mutationFn: WorkerService.create,
    onSuccess: () => {
      toast.success(AppStrings.workers.inviteSuccess);
      reset();
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen) return null;

  const isSubmitting = workerMutation.isPending;

  const onSubmit = (values: WorkerFormValues) => {
    workerMutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">{AppStrings.workers.addModalTitle}</h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <Input
            label={AppStrings.workers.name}
            placeholder="Chidi Obi"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label={AppStrings.auth.emailLabel}
            type="email"
            placeholder="chidi@contractor.io"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={AppStrings.workers.role}
            placeholder="Senior Smart Contract Engineer"
            error={errors.role?.message}
            {...register('role')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={AppStrings.workers.payAmount}
              placeholder="3500.00"
              error={errors.payAmount?.message}
              {...register('payAmount')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-foreground">{AppStrings.workers.payCurrency}</label>
              <select
                {...register('payCurrency')}
                className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground"
              >
                <option value={Currency.USD}>USD (USDC/USDT)</option>
                <option value={Currency.NGN}>NGN (Naira)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              {AppStrings.common.cancel}
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {AppStrings.workers.sendInvite}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
