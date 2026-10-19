export interface UpdateCompanyDto {
  name?: string;
  registrationNumber?: string;
  country?: string;
  activeRampProvider?: any;
  activeKycProvider?: any;
}

export interface CreateCompanyWalletDto {
  currency: string;
  network: string;
}

export interface AssetNetworkConfig {
  currency: string;
  name: string;
  networks: string[];
}

export interface CompanyFundingInfo {
  companyId: string;
  name: string;
  wallets: any[];
  supportedAssets: AssetNetworkConfig[];
}
