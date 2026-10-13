import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycCheckEntity, WorkerEntity } from '../../database/entities';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KycCheckEntity, WorkerEntity]),
    ProvidersModule,
  ],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
