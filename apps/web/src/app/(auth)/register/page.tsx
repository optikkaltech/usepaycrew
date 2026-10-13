'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, BuildingIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http, TokenService } from '@/services';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  registrationNumber: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();

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
      toast.success('Company account created successfully');
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
            <BuildingIcon className="h-6 w-6" />
          </div>
          <h1 className="text-display-sm text-foreground">{AppStrings.auth.registerTitle}</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">{AppStrings.auth.registerSubtitle}</p>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={AppStrings.auth.fullNameLabel}
              placeholder="Jane Doe"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label={AppStrings.auth.companyNameLabel}
              placeholder="Acme Tech Labs Ltd"
              error={errors.companyName?.message}
              {...register('companyName')}
            />

            <Input
              label={AppStrings.auth.emailLabel}
              type="email"
              placeholder="jane@acmetech.com"
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

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              {AppStrings.auth.registerButton}
            </Button>
          </form>

          <div className="mt-6 text-center text-body-sm text-muted-foreground">
            {AppStrings.auth.hasAccount}{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {AppStrings.auth.loginButton}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
