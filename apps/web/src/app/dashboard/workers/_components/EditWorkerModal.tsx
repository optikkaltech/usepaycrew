'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { AppStrings, XIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WorkerService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { Currency, PayFrequency } from '@paycrew/shared-types';

const editWorkerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  role: z.string().min(2, 'Job role is required'),
  country: z.string().min(2, 'Country code is required'),
  payAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  payCurrency: z.nativeEnum(Currency),
  payFrequency: z.nativeEnum(PayFrequency),
});

type EditWorkerFormValues = z.infer<typeof editWorkerSchema>;

interface EditWorkerModalProps {
  worker: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditWorkerModal({ worker, isOpen, onClose, onSuccess }: EditWorkerModalProps) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditWorkerFormValues>({
    resolver: zodResolver(editWorkerSchema),
    defaultValues: {
      name: '',
      role: '',
      country: 'NG',
      payAmount: '0.00',
      payCurrency: Currency.USD,
      payFrequency: PayFrequency.MONTHLY,
    },
  });

  useEffect(() => {
    if (worker) {
      reset({
        name: worker.name || '',
        role: worker.role || '',
        country: worker.country || 'NG',
        payAmount: worker.payAmount ? String(worker.payAmount) : '0.00',
        payCurrency: worker.payCurrency || Currency.USD,
        payFrequency: worker.payFrequency || PayFrequency.MONTHLY,
      });
    }
  }, [worker, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: EditWorkerFormValues) => {
      if (!worker?.id) throw new Error('Worker ID missing');
      return WorkerService.update(worker.id, values);
    },
    onSuccess: () => {
      toast.success(AppStrings.workers.updateSuccess);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen || !worker) return null;

  const onSubmit = (values: EditWorkerFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">{AppStrings.workers.editModalTitle}</h2>
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
            placeholder="Contractor Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label={AppStrings.workers.role}
            placeholder="Role / Title"
            error={errors.role?.message}
            {...register('role')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={AppStrings.workers.payAmount}
              placeholder="1000.00"
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-foreground">{AppStrings.workers.frequency}</label>
              <select
                {...register('payFrequency')}
                className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground"
              >
                <option value={PayFrequency.MONTHLY}>Monthly</option>
                <option value={PayFrequency.ONE_OFF}>One-Off</option>
              </select>
            </div>

            <Input
              label={AppStrings.workers.country}
              placeholder="NG, US, GB, etc."
              error={errors.country?.message}
              {...register('country')}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              {AppStrings.common.cancel}
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              {AppStrings.workers.saveChanges}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
