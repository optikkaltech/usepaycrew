'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckIcon, EyeIcon, EyeOffIcon } from '@/assets';
import { http, TokenService } from '@/services';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks';
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

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const data = await http.post('/auth/register', values);
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const onGoogleSignUp = async () => {
    try {
      const data = await http.post('/auth/google', {
        email: 'founder@paycrew-corp.io',
        name: 'Google Workspace Founder',
        companyName: 'Acme Global Ventures Ltd',
        googleId: `g_oauth_${Date.now()}`,
        role: 'COMPANY_OWNER',
      });
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Company account created with Google');
      router.push('/dashboard');
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <AuthShell showcaseHeadline="One Click Away from Studio-Grade Payroll">
      {/* Title & Subtitle */}
      <div className="mb-4">
        <h1 className="text-display-xs sm:text-display-sm font-heading font-semibold text-[#111827]">
          Create an Account
        </h1>
        <p className="mt-1 text-body-xs text-[#6B7280]">
          You are few moments away from getting started!
        </p>
      </div>

      {/* Checkbox: Send me tips, updates and offers */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSendUpdates(!sendUpdates)}
          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
            sendUpdates
              ? 'border-[#111827] bg-[#111827] text-white'
              : 'border-[#D1D5DB] bg-white text-transparent'
          }`}
          aria-label="Toggle promotional updates"
        >
          <CheckIcon className="h-3 w-3 stroke-[3]" />
        </button>
        <span className="text-caption text-gray-600 font-medium select-none">
          Send me tips, updates and offers
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name fields in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-label-xs font-semibold text-[#111827] mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-body-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-0.5 text-caption text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-label-xs font-semibold text-[#111827] mb-1">
              Company
            </label>
            <input
              type="text"
              placeholder="Acme Tech Ltd"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-body-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
              {...register('companyName')}
            />
            {errors.companyName && (
              <p className="mt-0.5 text-caption text-red-500">{errors.companyName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-label-xs font-semibold text-[#111827] mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-body-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-0.5 text-caption text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-label-xs font-semibold text-[#111827] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 pr-10 text-body-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-0.5 text-caption text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Terms Disclaimer */}
        <p className="text-[11px] text-gray-500 leading-snug pt-1">
          By signing up, you accept PayCrew{' '}
          <Link href="#" className="font-semibold text-gray-900 underline underline-offset-2">
            privacy policy
          </Link>{' '}
          and{' '}
          <Link href="#" className="font-semibold text-gray-900 underline underline-offset-2">
            terms of service
          </Link>
          .
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#0F1115] hover:bg-[#1E2025] text-white py-3 text-label-sm font-semibold transition-all shadow-md disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-3 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#E5E7EB]" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-medium text-gray-400 uppercase">
          or
        </span>
      </div>

      {/* Social OAuth Buttons */}
      <AuthSocialButtons onGoogleClick={onGoogleSignUp} isSubmitting={isSubmitting} />

      {/* Switch to Login */}
      <div className="mt-5 text-center text-caption text-gray-500">
        Already have an account?{' '}
        <Link href="/login" prefetch={true} className="font-bold text-gray-900 hover:underline">
          Log In
        </Link>
      </div>
    </AuthShell>
  );
}
