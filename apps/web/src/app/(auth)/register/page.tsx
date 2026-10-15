'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckIcon, EyeIcon, EyeOffIcon } from '@/assets';
import { useToast, useGoogleAuth, useRegister } from '@/hooks';
import { normalizeError } from '@/utils';
import { AuthShell } from '../_components/AuthShell';
import { AuthSocialButtons } from '../_components/AuthSocialButtons';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(true);
  const { initiateGoogleAuth, isGoogleLoading } = useGoogleAuth('/register', 'COMPANY_OWNER');
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const loading = registerMutation.isPending || isGoogleLoading;

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <AuthShell showcaseHeadline="One Click Away from Studio-Grade Payroll">
      <div className="mb-4">
        <h1 className="text-display-xs sm:text-display-sm font-heading font-semibold text-foreground">
          Create an Account
        </h1>
        <p className="mt-1 text-body-xs text-muted-foreground">
          You are few moments away from getting started!
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
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
          Send me tips, updates and offers
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
            <label className="block text-[12px] font-medium text-foreground/80 mb-1">Company</label>
            <input
              type="text"
              placeholder="Acme Tech Ltd"
              disabled={loading}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-body-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              {...register('companyName')}
            />
            {errors.companyName && <p className="mt-0.5 text-caption text-destructive">{errors.companyName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-foreground/80 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
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

        <p className="text-[11px] text-muted-foreground leading-snug pt-1">
          By signing up, you accept PayCrew{' '}
          <Link href="#" className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">privacy policy</Link>
          {' '}and{' '}
          <Link href="#" className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">terms of service</Link>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-label-sm font-semibold transition-all shadow-brand hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="relative my-3 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase">or</span>
      </div>

      <AuthSocialButtons onGoogleClick={initiateGoogleAuth} isSubmitting={loading} />

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
