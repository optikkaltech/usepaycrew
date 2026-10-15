import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, WorkerEntity } from '../../database/entities';
import { WorkerStatus, SubscriptionStatus, SubscriptionPlan, Currency } from '@paycrew/shared-types';

import { BankingProviderFactory } from '../../providers/banking/banking.factory';
import { RampProviderFactory } from '../../providers/ramp/ramp.factory';
import {
  SubscriptionBillingSummary,
  InitiateSubscriptionPaymentDto,
  SubscriptionPaymentResult,
} from './subscriptions.types';

@Injectable()
export class SubscriptionsService {
  private readonly BASE_WORKERS = 10;
  private readonly BASE_PRICE_NGN = 15000;
  private readonly BASE_PRICE_USD = 10;
  private readonly EXTRA_RATE_NGN = 1500;
  private readonly EXTRA_RATE_USD = 1;

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    private readonly bankingFactory: BankingProviderFactory,
    private readonly rampFactory: RampProviderFactory,
  ) {}

  async getBillingSummary(companyId: string): Promise<SubscriptionBillingSummary> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const activeWorkers = await this.workerRepo.count({
      where: { companyId, status: WorkerStatus.ACTIVE },
    });

    const extraWorkers = Math.max(0, activeWorkers - this.BASE_WORKERS);
    const totalMonthlyNgn = this.BASE_PRICE_NGN + extraWorkers * this.EXTRA_RATE_NGN;
    const totalMonthlyUsd = this.BASE_PRICE_USD + extraWorkers * this.EXTRA_RATE_USD;

    return {
      plan: company.subscriptionPlan || 'STARTER',
      status: company.subscriptionStatus || 'TRIALING',
      activeWorkers,
      baseWorkersIncluded: this.BASE_WORKERS,
      basePriceNgn: this.BASE_PRICE_NGN,
      basePriceUsd: this.BASE_PRICE_USD,
      extraWorkers,
      extraWorkerRateNgn: this.EXTRA_RATE_NGN,
      extraWorkerRateUsd: this.EXTRA_RATE_USD,
      totalMonthlyNgn,
      totalMonthlyUsd,
    };
  }

  async initiatePayment(
    companyId: string,
    dto: InitiateSubscriptionPaymentDto,
  ): Promise<SubscriptionPaymentResult> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const summary = await this.getBillingSummary(companyId);
    const ref = `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    if (dto.paymentMethod === 'CARD') {
      return {
        reference: ref,
        amount: dto.currency === 'NGN' ? summary.totalMonthlyNgn : summary.totalMonthlyUsd,
        currency: dto.currency || 'USD',
        paymentMethod: 'CARD',
      };
    }

    if (dto.paymentMethod === 'FREE') {
      company.subscriptionPlan = SubscriptionPlan.FREE;
      company.subscriptionStatus = SubscriptionStatus.ACTIVE;
      await this.companyRepo.save(company);
      return {
        reference: ref,
        amount: 0,
        currency: 'USD',
        paymentMethod: 'FREE',
      };
    }

    // Crypto subscription payment via Quidax (Dedicated USDT deposit)
    const ramp = this.rampFactory.getProvider(company.activeRampProvider);
    const network = dto.network || 'TRON';
    const deposit = await ramp.generateDepositAddress(Currency.USDT, network);

    if (!company.depositWalletAddress && deposit.address) {
      company.depositWalletAddress = deposit.address;
      await this.companyRepo.save(company);
    }

    return {
      reference: ref,
      amount: summary.totalMonthlyUsd,
      currency: 'USDT',
      paymentMethod: 'CRYPTO',
      depositAddress: deposit.address,
      network: deposit.network,
    };
  }

  async confirmPayment(companyId: string, reference: string, plan?: string): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    if (plan) {
      company.subscriptionPlan = (plan as SubscriptionPlan) || company.subscriptionPlan;
    }
    company.subscriptionStatus = SubscriptionStatus.ACTIVE;
    return this.companyRepo.save(company);
  }
}

