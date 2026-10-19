'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, CheckCircleIcon, MailIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { AuthShell } from '../_components/AuthShell';
import { useToast } from '@/hooks';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    // Simulate recovery email dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setSubmittedEmail(values.email);
    toast.success('Password reset instructions sent');
  };

  return (
    <AuthShell showcaseHeadline="Regain Access to Your Global Workforce Treasury">
      <div className="mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-caption font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
        <h1 className="text-display-xs sm:text-display-sm font-heading font-semibold text-foreground">
          Reset Password
        </h1>
        <p className="mt-1.5 text-body-xs text-muted-foreground">
          Enter your registered email address and we will send you instructions to reset your password.
        </p>
      </div>

      {submittedEmail ? (
        <div className="rounded-xl border border-border bg-secondary/30 p-5 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-label-md font-bold text-foreground">Check your inbox</h3>
            <p className="text-caption text-muted-foreground mt-1">
              We sent password reset instructions to{' '}
              <span className="font-semibold text-foreground">{submittedEmail}</span>.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setSubmittedEmail(null)}
            className="w-full min-h-[40px] border border-border mt-2"
          >
            Try another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-sm font-medium text-foreground mb-1">
              Registered Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="alex@company.com"
              disabled={isSubmitting}
              className="w-full min-h-[44px] px-3.5 text-body-sm bg-card border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            {errors.email && (
              <p className="mt-1 text-caption text-destructive">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] mt-2 bg-primary text-primary-foreground text-label-sm font-semibold rounded-lg hover:opacity-90 transition shadow-brand disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {isSubmitting ? 'Sending instructions...' : 'Send Reset Instructions'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
