import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerEntity, ContractEntity, UserEntity } from '../../database/entities';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';

import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkerEntity, ContractEntity, UserEntity]),
    ProvidersModule,
  ],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
