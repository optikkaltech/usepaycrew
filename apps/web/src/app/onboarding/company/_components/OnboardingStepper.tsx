'use client';

import { CheckIcon } from '@/assets';

interface OnboardingStepperProps {
  currentStep: 'PROFILE' | 'COMPLIANCE' | 'BILLING' | 'COMPLETED';
}

const STEPS = [
  { id: 'PROFILE', label: 'Profile', number: 1 },
  { id: 'COMPLIANCE', label: 'Compliance', number: 2 },
  { id: 'BILLING', label: 'Billing', number: 3 },
  { id: 'COMPLETED', label: 'Complete', number: 4 },
];

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute left-6 right-6 top-3.5 h-[1.5px] bg-border -z-0">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${(Math.max(0, currentIdx) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx || currentStep === 'COMPLETED';
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-caption font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : 'border border-border bg-card text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckIcon className="h-3.5 w-3.5 stroke-[2.5]" /> : step.number}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium tracking-tight transition-colors ${
                  isCurrent
                    ? 'text-primary font-semibold'
                    : isCompleted
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
