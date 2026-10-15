import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AddBankAccountDto {
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Nigerian NUBAN account number must be exactly 10 digits' })
  accountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Bank code is required' })
  bankCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Bank name is required' })
  bankName: string;
}

export class AddWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Wallet address is required' })
  walletAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Network is required (e.g. Polygon, Base, Solana)' })
  network: string;
}

export interface BankAccountLookupResult {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}
