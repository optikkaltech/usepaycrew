import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WorkerEntity,
  ContractEntity,
  UserEntity,
  KycCheckEntity,
  PayoutMethodEntity,
} from '../../database/entities';
import { WorkersService } from './workers.service';
import { WorkersInviteService } from './workers-invite.service';
import { WorkersController } from './workers.controller';
import { ProvidersModule } from '../../providers/providers.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkerEntity,
      ContractEntity,
      UserEntity,
      KycCheckEntity,
      PayoutMethodEntity,
    ]),
    ProvidersModule,
    AuthModule,
  ],
  controllers: [WorkersController],
  providers: [WorkersService, WorkersInviteService],
  exports: [WorkersService, WorkersInviteService],
})
export class WorkersModule {}
