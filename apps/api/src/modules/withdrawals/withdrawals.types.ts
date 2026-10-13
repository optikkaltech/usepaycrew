import { Currency } from '@paycrew/shared-types';

export interface WithdrawalCalculation {
  grossAmount: string;
  partnerFee: string;
  flatFee: string;
  stampDuty: string;
  totalDeductions: string;
  netPayoutNaira: string;
  exchangeRate: number; // e.g. 1 USD = 1,450 NGN
}

export interface InitiateWithdrawalDto {
  workerId: string;
  amount: string; // Amount in USD/USDC or NGN
  currency: Currency;
  payoutMethodId: string;
  otpOrPin: string;
}

export interface WithdrawalReceipt {
  receiptId: string;
  workerName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  grossAmount: string;
  netAmount: string;
  fees: string;
  stampDuty: string;
  currency: Currency;
  reference: string;
  completedAt: Date;
}
