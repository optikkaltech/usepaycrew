export enum UserRole {
  COMPANY_OWNER = 'COMPANY_OWNER',
  APPROVER = 'APPROVER',
  WORKER = 'WORKER',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
}

export enum WorkerStatus {
  INVITED = 'INVITED',
  ONBOARDING = 'ONBOARDING',
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

export enum KycCheckType {
  BVN = 'BVN',
  NIN = 'NIN',
  SELFIE_LIVENESS = 'SELFIE_LIVENESS',
  BANK_ACCOUNT_NAME = 'BANK_ACCOUNT_NAME',
}

export enum PayoutMethodType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  STABLECOIN_WALLET = 'STABLECOIN_WALLET',
}

export enum Currency {
  USD = 'USD',
  USDC = 'USDC',
  USDT = 'USDT',
  NGN = 'NGN',
}

export enum PayFrequency {
  ONE_OFF = 'ONE_OFF',
  MONTHLY = 'MONTHLY',
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export enum LedgerEntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum LedgerCategory {
  DEPOSIT = 'DEPOSIT',
  PAYROLL_PAYMENT = 'PAYROLL_PAYMENT',
  PAYROLL_FEE = 'PAYROLL_FEE',
  WITHDRAWAL = 'WITHDRAWAL',
  WITHDRAWAL_FEE = 'WITHDRAWAL_FEE',
  STAMP_DUTY = 'STAMP_DUTY',
  REVERSAL = 'REVERSAL',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface FeeCalculation {
  amount: number;
  feePercentage: number;
  feeAmount: number;
  fixedFee: number;
  stampDuty: number;
  totalDeduction: number;
  netPayout: number;
  currency: Currency;
}
