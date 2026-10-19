import { Currency, PaymentStatus } from '@paycrew/shared-types';

export interface TransactionLedgerEntry {
  id: string;
  reference: string;
  recipientName: string;
  recipientId: string;
  type: 'PAYROLL' | 'DEPOSIT' | 'WITHDRAWAL' | 'CONVERSION';
  amount: number;
  currency: Currency;
  fiatAmount: number;
  fiatCurrency: Currency;
  feeAmount: number;
  status: PaymentStatus;
  date: string;
  destination: string;
  hashOrReference?: string;
  note?: string;
}

export interface TransactionFilterParams {
  startDate?: string;
  endDate?: string;
  status?: PaymentStatus | 'ALL';
  type?: string | 'ALL';
  search?: string;
  page?: number;
  limit?: number;
}
