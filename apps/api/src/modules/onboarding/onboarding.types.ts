export interface UpdateCompanyProfileDto {
  name?: string;
  registrationNumber?: string;
  taxId?: string;
  industry?: string;
  country?: string;
}

export interface UpdateCompanyComplianceDto {
  directorName: string;
  directorBvnOrNin: string;
  documentType: string;
  documentUrl?: string;
}

export interface UpdateWorkerProfileDto {
  phone?: string;
  residentialAddress?: string;
  dateOfBirth?: string;
}

export interface OnboardingStatusResponse {
  currentStep: string;
  isComplete: boolean;
  company?: any;
  worker?: any;
}
