export interface DashboardPaymentItem {
  id: string;
  amount: string;
  currency: string;
  status: string;
  note?: string;
  createdAt: string;
  worker?: {
    id: string;
    name: string;
    email: string;
    country?: string;
    payoutCurrency?: string;
  };
}

export interface DashboardWorkerItem {
  id: string;
  name: string;
  email: string;
  role?: string;
  status: string;
  country?: string;
  payoutCurrency?: string;
  salary?: string;
}

export interface MarketRateData {
  pair: string;
  rate: number;
  source: string;
}
