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

export enum KycProviderType {
  PREMBLY = 'PREMBLY',
  SMILE_ID = 'SMILE_ID',
  DOJAH = 'DOJAH',
  MOCK = 'MOCK',
}

export enum RampProviderType {
  QUIDAX = 'QUIDAX',
  YELLOWCARD = 'YELLOWCARD',
  MOCK = 'MOCK',
}

export enum BankingProviderType {
  KORAPAY = 'KORAPAY',
  PAYSTACK = 'PAYSTACK',
  MOCK = 'MOCK',
}

export enum CryptoNetwork {
  TRON = 'TRON',
  POLYGON = 'POLYGON',
  BASE = 'BASE',
  ETHEREUM = 'ETHEREUM',
  BSC = 'BSC',
  SOLANA = 'SOLANA',
  ARBITRUM = 'ARBITRUM',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPlan {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}

export enum CompanyOnboardingStep {
  PROFILE = 'PROFILE',
  COMPLIANCE = 'COMPLIANCE',
  BILLING = 'BILLING',
  COMPLETED = 'COMPLETED',
}

export enum WorkerOnboardingStep {
  ACCOUNT = 'ACCOUNT',
  KYC = 'KYC',
  BANK = 'BANK',
  CONTRACT = 'CONTRACT',
  COMPLETED = 'COMPLETED',
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
  SUBSCRIPTION_FEE = 'SUBSCRIPTION_FEE',
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
