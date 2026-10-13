import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { WorkersModule } from './modules/workers/workers.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PayoutMethodsModule } from './modules/payout-methods/payout-methods.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    CompaniesModule,
    WorkersModule,
    KycModule,
    PayoutMethodsModule,
    ContractsModule,
    LedgerModule,
    PaymentsModule,
    WithdrawalsModule,
    AdminModule,
  ],
})
export class AppModule {}
