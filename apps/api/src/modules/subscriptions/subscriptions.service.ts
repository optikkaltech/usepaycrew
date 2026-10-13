import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, WorkerEntity } from '../../database/entities';
import { WorkerStatus, SubscriptionStatus } from '@paycrew/shared-types';

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

    if (dto.paymentMethod === 'KORAPAY' || dto.currency === 'NGN') {
      const banking = this.bankingFactory.getProvider();
      const va = banking.createVirtualAccount
        ? await banking.createVirtualAccount(company.name, ref)
        : null;

      return {
        reference: ref,
        amount: summary.totalMonthlyNgn,
        currency: 'NGN',
        paymentMethod: 'KORAPAY',
        virtualAccount: va
          ? {
              accountNumber: va.accountNumber,
              bankName: va.bankName,
              accountName: va.accountName,
            }
          : {
              accountNumber: company.virtualAccountNumber || '0129948192',
              bankName: company.virtualAccountBank || 'Providus Bank (Korapay)',
              accountName: `PAYCREW / ${company.name.toUpperCase()}`,
            },
      };
    }

    // Crypto subscription payment via Quidax / YellowCard
    const ramp = this.rampFactory.getProvider(company.activeRampProvider);
    const deposit = await ramp.generateDepositAddress(dto.currency as any, 'polygon');

    return {
      reference: ref,
      amount: summary.totalMonthlyUsd,
      currency: dto.currency,
      paymentMethod: 'CRYPTO',
      depositAddress: deposit.address,
      network: deposit.network,
    };
  }

  async confirmPayment(companyId: string, reference: string): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    company.subscriptionStatus = SubscriptionStatus.ACTIVE;
    return this.companyRepo.save(company);
  }
}

