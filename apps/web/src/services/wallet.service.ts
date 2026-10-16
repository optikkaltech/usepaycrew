import { http } from './http.service';

export interface CompanyWallet {
  id: string;
  companyId: string;
  currency: string;
  network: string;
  address: string;
  destinationTag?: string | null;
  qrCode?: string | null;
  createdAt: string;
}

export const WalletService = {
  getWallets: async (): Promise<CompanyWallet[]> => {
    return http.get('/companies/wallets');
  },
  createWallet: async (payload: { currency: string; network: string }): Promise<CompanyWallet> => {
    return http.post('/companies/wallets', payload);
  },
  getFundingInfo: async () => {
    return http.get('/companies/funding-info');
  },
};
