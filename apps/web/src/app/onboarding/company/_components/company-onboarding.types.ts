export interface CompanyProfileFormValues {
  name: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  country: string;
}

export interface CompanyComplianceFormValues {
  directorName: string;
  directorBvnOrNin: string;
  documentType: string;
}

export interface CompanyBillingFormValues {
  plan: string;
  paymentMethod: 'KORAPAY' | 'CRYPTO';
}
