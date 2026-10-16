import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity, CompanyWalletEntity } from '../../database/entities';
import { ProvidersModule } from '../../providers/providers.module';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, CompanyWalletEntity]),
    ProvidersModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
