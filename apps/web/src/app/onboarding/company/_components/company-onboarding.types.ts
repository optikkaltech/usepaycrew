export interface CompanyProfileFormValues {
  name: string;
  country: string;
  state: string;
  lga?: string;
  city?: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
}

export interface CompanyComplianceFormValues {
  directorName: string;
  directorBvnOrNin: string;
  documentType: string;
}

export interface CompanyBillingFormValues {
  plan: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  paymentMethod: 'CARD' | 'CRYPTO' | 'FREE';
}

export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  registrationLabel: string;
  registrationPlaceholder: string;
  taxIdLabel: string;
  taxIdPlaceholder: string;
  stateLabel: string;
  lgaLabel: string;
  hasLga: boolean;
  directorIdLabel: string;
  directorIdPlaceholder: string;
  directorDocTypes: Array<{ value: string; label: string }>;
}

export const INDUSTRIES = [
  'Technology & Software',
  'Fintech & Financial Services',
  'Crypto, Web3 & Blockchain',
  'E-Commerce & Digital Commerce',
  'Logistics, Transport & Supply Chain',
  'Healthcare & Biotechnology',
  'Education & EdTech',
  'Digital Media & Creative Agency',
  'Consulting & Professional Services',
  'Marketing, Advertising & PR',
  'Real Estate & PropTech',
  'Energy, Oil & Gas & Renewables',
  'Agriculture & Agribusiness',
  'Legal & Regulatory Compliance',
  'Human Resources & Staffing',
  'Telecommunications',
  'Manufacturing & Hardware',
  'Hospitality, Travel & Leisure',
  'Non-Profit, NGO & Impact',
  'Gaming & Interactive Entertainment',
  'Financial Auditing & Accounting',
  'Security & Risk Management',
  'Insurance & InsurTech',
  'Media, Publishing & News',
  'Other / General Business',
];
