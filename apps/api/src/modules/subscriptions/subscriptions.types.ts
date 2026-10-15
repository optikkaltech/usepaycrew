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
