'use client';

import { CheckCircleIcon } from '@/assets';

export interface PlanItem {
  id: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  name: string;
  badge?: string;
  priceFormatted?: string;
  priceSubtitle?: string;
  priceNgn?: string;
  priceUsd?: string;
  description: string;
  features: string;
  recommended?: boolean;
}

export const DEFAULT_PLANS: PlanItem[] = [
  {
    id: 'FREE',
    name: 'Free Starter',
    badge: 'Free Forever',
    priceFormatted: '₦0',
    priceSubtitle: '($0 USD / mo)',
    description: 'Perfect for small teams getting started with crypto payroll.',
    features: 'Up to 3 active contractor seats • No card required',
  },
  {
    id: 'STARTER',
    name: 'Growth Plan',
    badge: 'Recommended',
    recommended: true,
    priceFormatted: '₦15,000',
    priceSubtitle: '($10 USD / mo)',
    description: 'Ideal for remote teams paying up to 10 contractors.',
    features: '10 contractor seats • Unlimited payroll runs • Extra seats: $1/mo',
  },
  {
    id: 'GROWTH',
    name: 'Scale Plan',
    badge: 'Scaling Teams',
    priceFormatted: '₦45,000',
    priceSubtitle: '($30 USD / mo)',
    description: 'Designed for scaling companies requiring dual controls.',
    features: '50 contractor seats • Dual Maker-Checker approvals • Priority liquidity',
  },
];

interface BillingPlanSelectorProps {
  plans?: PlanItem[];
  selectedPlan: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  onSelectPlan: (plan: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE') => void;
  isLoading?: boolean;
}

export function BillingPlanSelector({
  plans,
  selectedPlan,
  onSelectPlan,
  isLoading,
}: BillingPlanSelectorProps) {
  const displayPlans = plans && plans.length > 0 ? plans : DEFAULT_PLANS;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-label-sm font-semibold text-foreground">Select Subscription Plan</label>
        {isLoading && <span className="text-caption text-muted-foreground animate-pulse">Updating rates...</span>}
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {displayPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`}
                  />
                  <span className="text-label-md font-bold text-foreground">{plan.name}</span>
                </div>
                {plan.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      plan.recommended ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-display-xs font-extrabold text-foreground">
                  {plan.priceFormatted || plan.priceNgn}
                </span>
                <span className="text-caption text-muted-foreground">
                  {plan.priceSubtitle || plan.priceUsd}
                </span>
              </div>
              <p className="mt-1 text-caption text-muted-foreground leading-relaxed">{plan.description}</p>
              <p className="mt-1 text-[11px] font-medium text-brand-emerald">{plan.features}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
