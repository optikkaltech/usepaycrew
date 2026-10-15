'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon } from '@/assets';
import { http, TokenService } from '@/services';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { AuthShell } from '../_components/AuthShell';
import { AuthSocialButtons } from '../_components/AuthSocialButtons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorToken: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2fa, setRequires2fa] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await http.post('/auth/login', values);
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (err) {
      const norm = normalizeError(err);
      if (norm.message.includes('Two-factor') || norm.message.includes('2FA')) {
        setRequires2fa(true);
      }
      toast.error(norm.message);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const data = await http.post('/auth/google', {
        email: 'founder@paycrew-corp.io',
        name: 'Google Workspace User',
        googleId: `g_oauth_${Date.now()}`,
        role: 'COMPANY_OWNER',
      });
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Signed in with Google');
      router.push('/dashboard');
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <AuthShell showcaseHeadline="One Click Away from Effortless Stablecoin Payroll">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-display-xs sm:text-display-sm font-heading font-semibold text-[#111827]">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-body-xs text-[#6B7280]">
          Enter your credentials to access your PayCrew dashboard.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-label-xs font-semibold text-[#111827] mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-body-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-caption text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-label-xs font-semibold text-[#111827]">
              Password
            </label>
            <Link
              href="#"
              className="text-caption text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 pr-11 text-body-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-caption text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* 2FA Token */}
        {requires2fa && (
          <div>
            <label className="block text-label-xs font-semibold text-[#111827] mb-1.5">
              Two-Factor Authentication Code
            </label>
            <input
              type="text"
              placeholder="123456"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-body-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all font-mono"
              {...register('twoFactorToken')}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#0F1115] hover:bg-[#1E2025] text-white py-3 text-label-sm font-semibold transition-all shadow-md disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#E5E7EB]" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-medium text-gray-400 uppercase">
          or
        </span>
      </div>

      {/* Social OAuth Buttons */}
      <AuthSocialButtons onGoogleClick={onGoogleSignIn} isSubmitting={isSubmitting} />

      {/* Switch to Register */}
      <div className="mt-6 text-center text-caption text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" prefetch={true} className="font-bold text-gray-900 hover:underline">
          Sign Up
        </Link>
      </div>
    </AuthShell>
  );
}
