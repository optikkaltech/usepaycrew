import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, WorkerEntity } from '../../database/entities';
import {
  CompanyOnboardingStep,
  SubscriptionPlan,
  SubscriptionStatus,
  KycStatus,
} from '@paycrew/shared-types';
import { KycProviderFactory } from '../../providers/kyc/kyc.factory';
import {
  UpdateCompanyProfileDto,
  UpdateCompanyComplianceDto,
  UpdateWorkerProfileDto,
  OnboardingStatusResponse,
} from './onboarding.types';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    private readonly kycFactory: KycProviderFactory,
  ) {}

  async getCompanyStatus(companyId: string): Promise<OnboardingStatusResponse> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const step = company.onboardingStep || CompanyOnboardingStep.PROFILE;
    return {
      currentStep: step,
      isComplete: step === CompanyOnboardingStep.COMPLETED,
      company,
    };
  }

  async submitCompanyProfile(companyId: string, dto: UpdateCompanyProfileDto): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    if (dto.name) company.name = dto.name;
    if (dto.registrationNumber) company.registrationNumber = dto.registrationNumber;
    if (dto.taxId) company.taxId = dto.taxId;
    if (dto.industry) company.industry = dto.industry;
    if (dto.country) company.country = dto.country;
    company.onboardingStep = CompanyOnboardingStep.COMPLIANCE;

    return this.companyRepo.save(company);
  }

  async submitCompanyCompliance(companyId: string, dto: UpdateCompanyComplianceDto): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    if (!dto.directorBvnOrNin || dto.directorBvnOrNin.length < 10) {
      throw new BadRequestException('A valid 11-digit BVN or NIN is required for corporate compliance');
    }

    const kycProvider = this.kycFactory.getProvider(company.activeKycProvider);
    const kycResult = await kycProvider.verifyNin(dto.directorBvnOrNin);
    if (!kycResult.success || kycResult.status !== KycStatus.APPROVED) {
      throw new BadRequestException(kycResult.reasonCode || 'Director identity check could not be verified');
    }

    company.onboardingStep = CompanyOnboardingStep.BILLING;
    return this.companyRepo.save(company);
  }

  async completeCompanyBilling(companyId: string, plan: string = 'STARTER'): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    company.subscriptionPlan = (plan as SubscriptionPlan) || SubscriptionPlan.STARTER;
    company.subscriptionStatus = SubscriptionStatus.ACTIVE;
    company.onboardingStep = CompanyOnboardingStep.COMPLETED;

    return this.companyRepo.save(company);
  }

  async getWorkerStatus(workerId: string): Promise<OnboardingStatusResponse> {
    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
      relations: ['kycChecks', 'payoutMethods'],
    });
    if (!worker) throw new NotFoundException('Worker not found');

    let currentStep = 'PROFILE';
    const isVerified = worker.kycChecks?.some((k) => k.status === KycStatus.APPROVED);
    if (isVerified) {
      currentStep = (worker.payoutMethods && worker.payoutMethods.length > 0) ? 'COMPLETED' : 'PAYOUT';
    } else if (worker.kycChecks && worker.kycChecks.length > 0) {
      currentStep = 'KYC';
    }

    return {
      currentStep,
      isComplete: currentStep === 'COMPLETED',
      worker,
    };
  }

  async updateWorkerProfile(workerId: string, dto: UpdateWorkerProfileDto): Promise<WorkerEntity> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    return this.workerRepo.save(worker);
  }
}

