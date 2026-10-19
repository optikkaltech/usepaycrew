import { Currency, PaymentStatus } from '@paycrew/shared-types';

export interface PayrollRecipientLine {
  workerId: string;
  name: string;
  role: string;
  payoutMethod: 'BANK_ACCOUNT' | 'STABLECOIN_WALLET';
  payoutCurrency: Currency;
  rateAmount: number;
  bonusAmount?: number;
  totalCryptoAmount: number;
  fiatEquivalent: number;
  destinationSummary: string;
  selected: boolean;
}

export interface PayrollCycleDraft {
  title: string;
  cycleDate: string;
  currency: Currency;
  recipients: PayrollRecipientLine[];
  subtotalCrypto: number;
  estimatedFeeCrypto: number;
  totalDebitCrypto: number;
  estimatedFiatTotal: number;
  exchangeRate: number;
}

export interface PayrollExecutionResult {
  batchId: string;
  totalProcessed: number;
  totalDisbursed: number;
  currency: Currency;
  status: PaymentStatus;
  executedAt: string;
  successfulCount: number;
  failedCount: number;
}
