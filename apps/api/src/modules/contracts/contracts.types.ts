export interface SignContractDto {
  typedName: string;
}

export interface ContractSignatureDetails {
  contractId: string;
  signedAt: Date;
  signedIp: string;
  signatureHash: string;
}
