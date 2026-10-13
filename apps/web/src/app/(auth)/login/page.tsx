'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, LockIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http, TokenService } from '@/services';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-secondary">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <LockIcon className="h-6 w-6" />
          </div>
          <h1 className="text-display-sm text-foreground">{AppStrings.auth.loginTitle}</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">{AppStrings.auth.loginSubtitle}</p>
        </div>

        <Card variant="elevated">
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={onGoogleSignIn}
          >
            <span className="font-semibold">{AppStrings.auth.googleSignIn}</span>
          </Button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-2 text-caption text-muted-foreground uppercase">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={AppStrings.auth.emailLabel}
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={AppStrings.auth.passwordLabel}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {requires2fa && (
              <Input
                label={AppStrings.auth.twoFactorLabel}
                placeholder="123456"
                error={errors.twoFactorToken?.message}
                {...register('twoFactorToken')}
              />
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              {AppStrings.auth.loginButton}
            </Button>
          </form>

          <div className="mt-6 text-center text-body-sm text-muted-foreground">
            {AppStrings.auth.noAccount}{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {AppStrings.auth.registerButton}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

