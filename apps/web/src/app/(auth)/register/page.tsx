'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckIcon, EyeIcon, EyeOffIcon, BuildingIcon, UserIcon, Loader2Icon } from '@/assets';
import { useGoogleAuth, useRegister } from '@/hooks';
import { Tabs } from '@/components/ui/Tabs';
import { AuthShell } from '../_components/AuthShell';
import { AuthSocialButtons } from '../_components/AuthSocialButtons';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().min(2, 'Organization or professional role is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'contractor' ? 'contractor' : 'company';
  const [roleType, setRoleType] = useState<string>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(true);

  const isContractor = roleType === 'contractor';
  const defaultRole = isContractor ? 'WORKER' : 'COMPANY_OWNER';
  const { initiateGoogleAuth, isGoogleLoading } = useGoogleAuth('/register', defaultRole);
  const registerMutation = useRegister();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const loading = registerMutation.isPending || isGoogleLoading;

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      { ...values, role: defaultRole } as any,
      { onSuccess: () => setIsRedirecting(true), onError: () => setIsRedirecting(false) },
    );
  };

  return (
    <AuthShell showcaseHeadline="One Click Away from Studio-Grade Payroll">
      <div className="mb-4">
        <Tabs
          tabs={[
            { id: 'company', label: 'Company Account', icon: BuildingIcon },
            { id: 'contractor', label: 'Contractor Account', icon: UserIcon },
          ]}
          activeTab={roleType}
          onChange={(id) => setRoleType(id)}
          fullWidth
        />
        <h1 className="mt-4 text-display-xs sm:text-display-sm font-heading font-semibold text-foreground">
          {isContractor ? 'Create Contractor Account' : 'Create Company Account'}
        </h1>
        <p className="mt-1 text-body-xs text-muted-foreground">
          {isContractor
            ? 'Receive salary in USDT/USDC and withdraw directly to local bank rails.'
            : 'Automate global contractor payroll and instant treasury off-ramping.'}
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSendUpdates(!sendUpdates)}
          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors cursor-pointer ${
            sendUpdates ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-transparent'
          }`}
          aria-label="Toggle promotional updates"
        >
          <CheckIcon className="h-3 w-3 stroke-[3]" />
        </button>
        <span className="text-caption text-muted-foreground font-medium select-none">
          Send me product updates and treasury notifications
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[12px] font-medium text-foreground/80 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              disabled={loading}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-body-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              {...register('fullName')}
            />
            {errors.fullName && <p className="mt-0.5 text-caption text-destructive">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground/80 mb-1">
              {isContractor ? 'Professional Title / Skill' : 'Company Name'}
            </label>
            <input
              type="text"
              placeholder={isContractor ? 'Software Engineer' : 'Acme Tech Ltd'}
              disabled={loading}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-body-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              {...register('companyName')}
            />
            {errors.companyName && <p className="mt-0.5 text-caption text-destructive">{errors.companyName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-foreground/80 mb-1">
            {isContractor ? 'Contractor Email' : 'Work Email'}
          </label>
          <input
            type="email"
            placeholder={isContractor ? 'talent@contractor.com' : 'alex@acme.com'}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-body-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            {...register('email')}
          />
          {errors.email && <p className="mt-0.5 text-caption text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-foreground/80 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              disabled={loading}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 pr-10 text-body-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-0.5 text-caption text-destructive">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || isRedirecting}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-label-sm font-semibold transition-all shadow-brand hover:opacity-90 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading || isRedirecting ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin text-primary-foreground" />
              <span>{isRedirecting ? 'Launching workspace...' : 'Creating account...'}</span>
            </>
          ) : isContractor ? (
            'Sign up as Contractor'
          ) : (
            'Sign up as Company'
          )}
        </button>
      </form>

      <div className="relative my-3 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase">or</span>
      </div>

      <AuthSocialButtons onGoogleClick={() => initiateGoogleAuth(defaultRole)} isSubmitting={loading} />

      <div className="mt-5 text-center text-caption text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" prefetch={true} className="font-bold text-foreground hover:underline">
          Log In
        </Link>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RegisterForm />
    </Suspense>
  );
}
