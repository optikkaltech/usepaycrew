export interface BankInfo {
  code: string;
  name: string;
}

export interface BankAccountResolution {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  bankName: string;
}

export interface NairaDisbursementParams {
  amount: number;
  reference: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  narration: string;
}

export interface VirtualAccountDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  reference: string;
}

export interface IBankingProvider {
  resolveAccount(accountNumber: string, bankCode: string): Promise<BankAccountResolution>;
  getBanks(): Promise<BankInfo[]>;
  disburseNaira(params: NairaDisbursementParams): Promise<{ success: boolean; reference: string }>;
  createVirtualAccount?(companyName: string, reference: string): Promise<VirtualAccountDetails>;
  verifyWebhook?(payload: any, signature: string): boolean;
}

