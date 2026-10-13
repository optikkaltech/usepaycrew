import { Module } from '@nestjs/common';
import { QuidaxRampProvider } from './ramp/quidax.provider';
import { YellowCardRampProvider } from './ramp/yellowcard.provider';
import { MockRampProvider } from './ramp/mock-ramp.provider';
import { RampProviderFactory } from './ramp/ramp.factory';

import { PremblyKycProvider } from './kyc/prembly.provider';
import { SmileIdKycProvider } from './kyc/smile-id.provider';
import { DojahKycProvider } from './kyc/dojah.provider';
import { MockKycProvider } from './kyc/mock-kyc.provider';
import { KycProviderFactory } from './kyc/kyc.factory';

import { KorapayBankingProvider } from './banking/korapay-banking.provider';
import { BankingProviderFactory } from './banking/banking.factory';

@Module({
  providers: [
    QuidaxRampProvider,
    YellowCardRampProvider,
    MockRampProvider,
    RampProviderFactory,

    PremblyKycProvider,
    SmileIdKycProvider,
    DojahKycProvider,
    MockKycProvider,
    KycProviderFactory,

    KorapayBankingProvider,
    BankingProviderFactory,
  ],
  exports: [
    RampProviderFactory,
    KycProviderFactory,
    BankingProviderFactory,
  ],
})
export class ProvidersModule {}
