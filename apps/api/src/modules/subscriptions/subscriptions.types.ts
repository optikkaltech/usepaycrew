export interface SubscriptionBillingSummary {
  plan: string;
  status: string;
  activeWorkers: number;
  baseWorkersIncluded: number;
  basePriceNgn: number;
  basePriceUsd: number;
  extraWorkers: number;
  extraWorkerRateNgn: number;
  extraWorkerRateUsd: number;
  totalMonthlyNgn: number;
  totalMonthlyUsd: number;
  primaryCurrency: string;
  isNaira: boolean;
  totalMonthlyFormatted: string;
}

export interface AdminUpsertPlanDto {
  code: string;
  name: string;
  badge?: string;
  baseWorkers: number;
  basePriceNgn: number;
  basePriceUsd: number;
  extraWorkerRateNgn: number;
  extraWorkerRateUsd: number;
  description?: string;
  features?: string;
  isActive?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
}

export interface InitiateSubscriptionPaymentDto {
  currency?: 'NGN' | 'USDT' | 'USDC' | 'USD';
  paymentMethod: 'CARD' | 'CRYPTO' | 'FREE' | 'KORAPAY';
  network?: string;
  plan?: string;
}

export interface SubscriptionPaymentResult {
  reference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  checkoutUrl?: string;
  virtualAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  depositAddress?: string;
  network?: string;
}
