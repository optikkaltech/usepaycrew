'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon, BuildingIcon, UserIcon, Loader2Icon } from '@/assets';
import { useToast, useGoogleAuth, useLogin } from '@/hooks';
import { normalizeError } from '@/utils';
import { Tabs } from '@/components/ui/Tabs';
import { AuthShell } from '../_components/AuthShell';
import { AuthSocialButtons } from '../_components/AuthSocialButtons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorToken: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2fa, setRequires2fa] = useState(false);
  const [authType, setAuthType] = useState<string>('company');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { initiateGoogleAuth, isGoogleLoading } = useGoogleAuth('/login');
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const isSubmitting = loginMutation.isPending;

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => setIsRedirecting(true),
      onError: (err) => {
        setIsRedirecting(false);
        const norm = normalizeError(err);
        if (norm.message.includes('Two-factor') || norm.message.includes('2FA')) setRequires2fa(true);
        toast.error(norm.message);
      },
    });
  };

  const isCompany = authType === 'company';

  return (
    <AuthShell showcaseHeadline="One Click Away from Effortless Stablecoin Payroll">
      <div className="mb-4">
        {/* Role Split Selector */}
        <div className="mb-6">
          <Tabs
            tabs={[
              { id: 'company', label: 'Sign in as Company', icon: BuildingIcon },
              { id: 'contractor', label: 'Sign in as Contractor', icon: UserIcon },
            ]}
            activeTab={authType}
            onChange={(tabId) => setAuthType(tabId)}
            fullWidth
          />
        </div>

        <h1 className="text-display-xs sm:text-display-sm font-heading font-semibold text-foreground">
          {isCompany ? 'Company Sign In' : 'Contractor Sign In'}
        </h1>
        <p className="mt-1 text-body-xs text-muted-foreground">
          {isCompany
            ? 'Access your corporate treasury, team roster, and payroll runs.'
            : 'Access your earnings, withdraw to bank, or hold your balance.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-sm font-medium text-foreground mb-1">
            {isCompany ? 'Work Email' : 'Contractor Email'}
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder={isCompany ? 'alex@acme.com' : 'talent@contractor.com'}
            disabled={isSubmitting || isGoogleLoading}
            className="w-full min-h-[44px] px-3.5 text-body-sm bg-card border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {errors.email && (
            <p className="mt-1 text-caption text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-label-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-caption font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full min-h-[44px] px-3.5 pr-10 text-body-sm bg-card border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-caption text-destructive">{errors.password.message}</p>
          )}
        </div>

        {requires2fa && (
          <div>
            <label className="block text-label-sm font-medium text-foreground mb-1">
              Two-Factor Authentication Code
            </label>
            <input
              {...register('twoFactorToken')}
              type="text"
              placeholder="6-digit authenticator code"
              maxLength={6}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full min-h-[44px] px-3.5 text-body-sm bg-card border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-mono tracking-widest text-center"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading || isRedirecting}
          className="w-full min-h-[44px] mt-2 bg-primary text-primary-foreground text-label-sm font-semibold rounded-lg hover:opacity-90 transition shadow-brand disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting || isRedirecting ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin text-primary-foreground" />
              <span>{isRedirecting ? 'Launching portal...' : 'Signing in...'}</span>
            </>
          ) : isCompany ? (
            'Sign in to Company'
          ) : (
            'Sign in to Portal'
          )}
        </button>
      </form>

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase">
          or
        </span>
      </div>

      <AuthSocialButtons
        onGoogleClick={() => initiateGoogleAuth(isCompany ? 'COMPANY_OWNER' : 'WORKER')}
        isSubmitting={isSubmitting || isGoogleLoading}
      />

      <div className="mt-6 text-center text-caption text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={isCompany ? '/register' : '/register?role=contractor'}
          prefetch={true}
          className="font-bold text-foreground hover:underline"
        >
          {isCompany ? 'Sign Up as Company' : 'Register as Contractor'}
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
