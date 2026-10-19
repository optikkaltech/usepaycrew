'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheckIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils';
import { useAuthStore } from '@/store';

export interface ContractFormValues {
  password?: string;
  typedSignature: string;
}

interface ContractStepProps {
  worker: any;
  onSubmit: (values: ContractFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ContractStep({ worker, onSubmit, isLoading }: ContractStepProps) {
  const contract = worker.contracts?.[0];
  const { user, isAuthenticated } = useAuthStore();

  const isMatchingLoggedInUser =
    isAuthenticated &&
    user?.email?.toLowerCase() === worker.email?.toLowerCase();

  const isExisting = worker.isExistingUser;

  const contractSchema = z.object({
    password: isMatchingLoggedInUser
      ? z.string().optional()
      : isExisting
      ? z.string().min(1, 'Please enter your account password')
      : z.string().min(8, 'Password must be at least 8 characters'),
    typedSignature: z.string().min(2, 'Please type your legal name to sign'),
  });

  type FormValues = z.infer<typeof contractSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contractSchema),
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="rounded-xl bg-secondary/60 p-4 border border-border">
        <p className="text-caption text-muted-foreground">Agreed Compensation</p>
        <p className="text-display-sm font-extrabold text-foreground mt-0.5">
          {formatCurrency(worker.payAmount, worker.payCurrency)}
        </p>
        <p className="text-body-xs text-muted-foreground mt-0.5">
          Role: <span className="font-semibold text-foreground">{worker.role}</span> ({worker.payFrequency})
        </p>
      </div>

      {contract && (
        <div className="rounded-xl border border-border p-4 bg-background/50 max-h-44 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-brand-emerald mb-2">
            <ShieldCheckIcon className="h-4 w-4" />
            <span className="text-label-sm font-bold">{contract.title || 'Independent Contractor Agreement'}</span>
          </div>
          <p className="text-body-xs text-muted-foreground whitespace-pre-line font-mono text-[11px] leading-relaxed">
            {contract.content}
          </p>
        </div>
      )}

      {isMatchingLoggedInUser ? (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-foreground">
          <CheckCircleIcon className="h-4 w-4 text-brand-emerald shrink-0" />
          <span className="text-body-xs">
            Logged in as <strong>{user?.email}</strong>. Accepting will link this role to your existing PayCrew profile.
          </span>
        </div>
      ) : isExisting ? (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/60 border border-border text-foreground">
          <span className="text-body-xs">
            Welcome back, <strong>{worker.existingUserName || worker.name}</strong>! You already have an active PayCrew account. Enter your password to accept this invitation.
          </span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isMatchingLoggedInUser && (
          <Input
            label={isExisting ? 'Enter Your PayCrew Password' : 'Set Your Account Password'}
            type="password"
            placeholder="••••••••"
            hint={
              isExisting
                ? 'Your existing password will authenticate and link this contractor role.'
                : 'Minimum 8 characters. Used to access your earnings dashboard.'
            }
            error={errors.password?.message}
            {...register('password')}
          />
        )}

        <Input
          label="Type Full Legal Name (Electronic Signature)"
          placeholder={worker.name}
          hint="By typing your name, you execute this independent contractor agreement."
          error={errors.typedSignature?.message}
          {...register('typedSignature')}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[44px]">
          Accept Contract &amp; Continue
        </Button>
      </form>
    </Card>
  );
}
