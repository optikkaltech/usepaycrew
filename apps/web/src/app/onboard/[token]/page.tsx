'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AppStrings,
  FileCheckIcon,
  ShieldCheckIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';

const onboardSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  typedSignature: z.string().min(2, 'Please type your full legal name to sign'),
});

type OnboardFormValues = z.infer<typeof onboardSchema>;

export default function OnboardWorkerPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<'CONTRACT' | 'DONE'>('CONTRACT');

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['workerInvite', resolvedParams.token],
    queryFn: () => http.get(`/workers/invite/${resolvedParams.token}`),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardFormValues>({
    resolver: zodResolver(onboardSchema),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-body-md text-muted-foreground">{AppStrings.common.loading}</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md text-center p-6">
          <p className="text-display-sm text-destructive">Invalid or Expired Link</p>
          <p className="mt-2 text-body-sm text-muted-foreground">
            This invitation link is no longer valid or has already been used. Please contact your employer.
          </p>
        </Card>
      </div>
    );
  }

  const contract = worker.contracts?.[0];

  const onSubmit = async (values: OnboardFormValues) => {
    try {
      const onboardRes = await http.post('/workers/accept-invite', {
        token: resolvedParams.token,
        password: values.password,
      });

      if (contract?.id) {
        await http.post(`/contracts/${contract.id}/sign`, {
          typedName: values.typedSignature,
        });
      }

      toast.success('Account activated & contract signed successfully!');
      setStep('DONE');
      setTimeout(() => {
        router.push(`/worker/${onboardRes.worker.id}`);
      }, 1500);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-secondary">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <FileCheckIcon className="h-6 w-6" />
          </div>
          <h1 className="text-display-sm text-foreground">Welcome to PayCrew, {worker.name}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            You&apos;ve been invited by <span className="font-semibold text-foreground">{worker.company?.name}</span> to receive stablecoin payroll
          </p>
        </div>

        <Card variant="elevated" className="flex flex-col gap-5">
          <div className="rounded-lg bg-secondary/60 p-4 border border-border">
            <p className="text-caption text-muted-foreground">Agreed Compensation</p>
            <p className="text-display-sm font-extrabold text-foreground">
              {formatCurrency(worker.payAmount, worker.payCurrency)}
            </p>
            <p className="text-body-xs text-muted-foreground mt-0.5">Role: {worker.role} ({worker.payFrequency})</p>
          </div>

          {contract && (
            <div className="rounded-lg border border-border p-4 bg-background max-h-48 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-primary mb-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span className="text-label-sm font-bold">{contract.title}</span>
              </div>
              <p className="text-body-xs text-muted-foreground whitespace-pre-line font-mono">{contract.content}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Set Your Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Type Full Legal Name (Electronic Signature)"
              placeholder={worker.name}
              hint="By typing your name, you agree to the independent contractor agreement."
              error={errors.typedSignature?.message}
              {...register('typedSignature')}
            />

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              Accept &amp; Sign Agreement
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
