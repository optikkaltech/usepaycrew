import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity, WorkerEntity, SubscriptionPlanEntity } from '../../database/entities';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, WorkerEntity, SubscriptionPlanEntity]),
    ProvidersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
