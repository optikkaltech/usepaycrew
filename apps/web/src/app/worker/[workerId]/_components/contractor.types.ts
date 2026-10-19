export type ContractorTab =
  | 'overview'
  | 'convert'
  | 'earnings'
  | 'wallet'
  | 'banks'
  | 'settings';

export interface ContractorSidebarItem {
  id: ContractorTab;
  label: string;
}
