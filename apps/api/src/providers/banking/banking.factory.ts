import { Injectable } from '@nestjs/common';
import { IBankingProvider } from './banking.interface';
import { KorapayBankingProvider } from './korapay-banking.provider';

@Injectable()
export class BankingProviderFactory {
  constructor(private readonly korapay: KorapayBankingProvider) {}

  getProvider(): IBankingProvider {
    return this.korapay;
  }
}

