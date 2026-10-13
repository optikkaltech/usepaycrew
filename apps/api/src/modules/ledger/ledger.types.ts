import { Currency, LedgerCategory, LedgerEntryType } from '@paycrew/shared-types';

export interface PostEntryParams {
  companyId?: string | null;
  workerId?: string | null;
  accountType: 'COMPANY' | 'WORKER' | 'PLATFORM_REVENUE' | 'ESCROW';
  amount: string;
  currency: Currency;
  entryType: LedgerEntryType;
  category: LedgerCategory;
  reference: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface BalanceSummary {
  currency: Currency;
  availableBalance: string;
  totalCredits: string;
  totalDebits: string;
}

export interface PayrollTransferParams {
  companyId: string;
  workerId: string;
  amount: string;
  currency: Currency;
  feeAmount: string;
  paymentId: string;
  idempotencyKey: string;
}

export interface WithdrawalTransferParams {
  workerId: string;
  amount: string;
  currency: Currency;
  feeAmount: string;
  stampDuty: string;
  withdrawalRef: string;
}
