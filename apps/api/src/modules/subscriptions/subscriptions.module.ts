import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity, WorkerEntity } from '../../database/entities';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, WorkerEntity]),
    ProvidersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
