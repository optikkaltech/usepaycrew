import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity, WorkerEntity, CompanyEntity } from '../../database/entities';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { LedgerModule } from '../ledger/ledger.module';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, WorkerEntity, CompanyEntity]),
    LedgerModule,
    ProvidersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

