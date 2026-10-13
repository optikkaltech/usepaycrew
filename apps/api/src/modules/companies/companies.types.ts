export interface UpdateCompanyDto {
  name?: string;
  registrationNumber?: string;
  country?: string;
}

export interface CompanyFundingInfo {
  companyId: string;
  name: string;
  virtualAccountBank: string | null;
  virtualAccountNumber: string | null;
  depositWalletAddress: string | null;
  supportedCurrencies: string[];
}
