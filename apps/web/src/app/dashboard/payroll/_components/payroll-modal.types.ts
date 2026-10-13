export interface PaymentFormValues {
  workerId: string;
  amount: string;
  note?: string;
  twoFactorToken?: string;
}

export interface FeeEstimateResult {
  amount: string;
  currency: string;
  feePercentage: number;
  feeAmount: string;
  totalCharged: string;
}

export interface CompanyBalanceResult {
  availableBalance: string;
  currency: string;
}
