import { WorkerStatus, Currency, PayoutMethodType } from '@paycrew/shared-types';

export interface ContractorMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: WorkerStatus;
  rate: number;
  rateCurrency: Currency;
  preferredPayout: PayoutMethodType;
  payoutCurrency: Currency;
  country: string;
  lifetimePaid: number;
  bankAccount?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
  };
  walletAddress?: string;
  joinedAt: string;
  lastPaidAt?: string;
}

export interface ContractorFilterParams {
  search?: string;
  status?: WorkerStatus | 'ALL';
  country?: string;
  payoutMethod?: PayoutMethodType | 'ALL';
}

export interface BulkImportRow {
  name: string;
  email: string;
  role: string;
  rate: number;
  rateCurrency: string;
  payoutCurrency: string;
  country: string;
  bankName?: string;
  accountNumber?: string;
}
