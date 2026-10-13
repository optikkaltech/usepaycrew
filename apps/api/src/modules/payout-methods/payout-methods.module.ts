import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutMethodEntity, WorkerEntity } from '../../database/entities';
import { PayoutMethodsService } from './payout-methods.service';
import { PayoutMethodsController } from './payout-methods.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayoutMethodEntity, WorkerEntity]),
    ProvidersModule,
  ],
  controllers: [PayoutMethodsController],
  providers: [PayoutMethodsService],
  exports: [PayoutMethodsService],
})
export class PayoutMethodsModule {}

