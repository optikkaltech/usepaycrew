import { Currency, CryptoNetwork } from '@paycrew/shared-types';

export interface CompanyWalletBalance {
  currency: Currency;
  availableBalance: number;
  lockedBalance: number;
  fiatEquivalentNgn: number;
  rateToNgn: number;
}

export interface DepositWalletAddress {
  currency: Currency;
  network: CryptoNetwork;
  address: string;
  memoOrTag?: string;
  qrCodeUrl: string;
  minimumDeposit: number;
  confirmationBlocks: number;
}

export interface ConversionQuote {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  network: string;
  expiresInSeconds: number;
}

export interface AutoFundingSetting {
  enabled: boolean;
  thresholdUsd: number;
  targetDepositUsd: number;
  preferredNetwork: CryptoNetwork;
}
