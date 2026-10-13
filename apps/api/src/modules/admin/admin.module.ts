import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuditLogEntity,
  KycCheckEntity,
  PaymentEntity,
  WorkerEntity,
} from '../../database/entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KycCheckEntity,
      PaymentEntity,
      AuditLogEntity,
      WorkerEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
