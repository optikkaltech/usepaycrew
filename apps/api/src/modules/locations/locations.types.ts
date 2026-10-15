export interface CountryConfig {
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
