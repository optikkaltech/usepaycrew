'use client';

import clsx from 'clsx';
import { CheckIcon } from '@/assets';

export type OnboardStep = 'CONTRACT' | 'KYC' | 'BANK' | 'DONE';

interface OnboardStepperProps {
  currentStep: OnboardStep;
}

const STEPS: { id: OnboardStep; label: string }[] = [
  { id: 'CONTRACT', label: 'Contract & Account' },
  { id: 'KYC', label: 'Identity Verification' },
  { id: 'BANK', label: 'Payout & Bank' },
  { id: 'DONE', label: 'Ready' },
];

export function OnboardStepper({ currentStep }: OnboardStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full text-caption font-bold transition-all',
                    isCompleted && 'bg-brand-emerald text-black shadow-[0_0_10px_rgba(6,214,160,0.3)]',
                    isCurrent && 'border-2 border-brand-emerald bg-card text-brand-emerald font-extrabold',
                    !isCompleted && !isCurrent && 'border border-border bg-secondary text-muted-foreground',
                  )}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={clsx(
                    'mt-1.5 text-[11px] font-medium hidden sm:block text-center',
                    isCurrent && 'text-foreground font-semibold',
                    !isCurrent && 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={clsx(
                    'mx-2 h-0.5 flex-1 transition-all',
                    idx < currentIndex ? 'bg-brand-emerald' : 'bg-border',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
