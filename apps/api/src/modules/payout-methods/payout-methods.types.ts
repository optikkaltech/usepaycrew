import { PayoutMethodType } from '@paycrew/shared-types';

export interface AddBankAccountDto {
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

export interface AddWalletDto {
  walletAddress: string;
  network: string; // e.g. 'Polygon', 'Base', 'Solana', 'Ethereum'
}

export interface BankAccountLookupResult {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}
