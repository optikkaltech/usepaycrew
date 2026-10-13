import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity, WorkerEntity } from '../../database/entities';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, WorkerEntity]),
    ProvidersModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
