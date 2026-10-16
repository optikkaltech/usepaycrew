import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, WorkerEntity, SubscriptionPlanEntity } from '../../database/entities';
import {
  WorkerStatus,
  SubscriptionStatus,
  SubscriptionPlan,
  Currency,
  RampProviderType,
  getCurrencyForCountry,
} from '@paycrew/shared-types';
import { BankingProviderFactory } from '../../providers/banking/banking.factory';
import { RampProviderFactory } from '../../providers/ramp/ramp.factory';
import {
  SubscriptionBillingSummary,
  InitiateSubscriptionPaymentDto,
  SubscriptionPaymentResult,
  AdminUpsertPlanDto,
} from './subscriptions.types';
import { DEFAULT_SUBSCRIPTION_PLANS } from './subscriptions.seed';

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(SubscriptionPlanEntity)
    private readonly planRepo: Repository<SubscriptionPlanEntity>,
    private readonly bankingFactory: BankingProviderFactory,
    private readonly rampFactory: RampProviderFactory,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultPlans();
  }

  async seedDefaultPlans(): Promise<void> {
    const count = await this.planRepo.count();
    if (count > 0) return;

    for (const d of DEFAULT_SUBSCRIPTION_PLANS) {
      await this.planRepo.save(this.planRepo.create(d));
    }
  }

  async getActivePlans(country?: string): Promise<any[]> {
    const plans = await this.planRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    const isNg = (country || 'NG').toUpperCase() === 'NG';

    return plans.map((p) => ({
      id: p.code,
      name: p.name,
      badge: p.badge,
      recommended: p.isRecommended,
      priceFormatted: isNg ? `₦${Number(p.basePriceNgn).toLocaleString()}` : `$${Number(p.basePriceUsd)} USD`,
      priceSubtitle: isNg ? `($${Number(p.basePriceUsd)} USD / mo)` : `(≈ ${Number(p.basePriceUsd)} USDT)`,
      basePrice: isNg ? Number(p.basePriceNgn) : Number(p.basePriceUsd),
      currency: isNg ? 'NGN' : 'USD',
      description: p.description,
      features: p.features,
      baseWorkers: p.baseWorkers,
    }));
  }

  async getBillingSummary(companyId: string): Promise<SubscriptionBillingSummary> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const planCode = (company.subscriptionPlan as SubscriptionPlan) || SubscriptionPlan.STARTER;
    const plan = (await this.planRepo.findOne({ where: { code: planCode } })) || {
      baseWorkers: 10,
      basePriceNgn: 15000,
      basePriceUsd: 10,
      extraWorkerRateNgn: 1500,
      extraWorkerRateUsd: 1,
    };

    const activeWorkers = await this.workerRepo.count({ where: { companyId, status: WorkerStatus.ACTIVE } });
    const extraWorkers = Math.max(0, activeWorkers - plan.baseWorkers);
    const totalMonthlyNgn = Number(plan.basePriceNgn) + extraWorkers * Number(plan.extraWorkerRateNgn);
    const totalMonthlyUsd = Number(plan.basePriceUsd) + extraWorkers * Number(plan.extraWorkerRateUsd);
    const currencyInfo = getCurrencyForCountry(company.country);

    return {
      plan: planCode,
      status: company.subscriptionStatus || 'TRIALING',
      activeWorkers,
      baseWorkersIncluded: plan.baseWorkers,
      basePriceNgn: Number(plan.basePriceNgn),
      basePriceUsd: Number(plan.basePriceUsd),
      extraWorkers,
      extraWorkerRateNgn: Number(plan.extraWorkerRateNgn),
      extraWorkerRateUsd: Number(plan.extraWorkerRateUsd),
      totalMonthlyNgn,
      totalMonthlyUsd,
      primaryCurrency: currencyInfo.primaryCurrency,
      isNaira: currencyInfo.isNaira,
      totalMonthlyFormatted: currencyInfo.isNaira
        ? `₦${totalMonthlyNgn.toLocaleString()}`
        : `$${totalMonthlyUsd.toLocaleString()}`,
    };
  }

  async initiatePayment(companyId: string, dto: InitiateSubscriptionPaymentDto): Promise<SubscriptionPaymentResult> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const summary = await this.getBillingSummary(companyId);
    const ref = `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    if (dto.paymentMethod === 'FREE') {
      company.subscriptionPlan = SubscriptionPlan.FREE;
      company.subscriptionStatus = SubscriptionStatus.ACTIVE;
      await this.companyRepo.save(company);
      return { reference: ref, amount: 0, currency: 'USD', paymentMethod: 'FREE' };
    }

    if (dto.paymentMethod === 'CARD' || dto.paymentMethod === 'KORAPAY') {
      const banking = this.bankingFactory.getProvider();
      const amount = summary.isNaira ? summary.totalMonthlyNgn : summary.totalMonthlyUsd;
      const currency = summary.isNaira ? 'NGN' : 'USD';

      let checkoutUrl: string | undefined;
      if (banking.initializeCheckout) {
        const checkout = await banking.initializeCheckout({
          reference: ref,
          amount,
          customerName: company.name,
          customerEmail: `billing+${company.id.slice(0, 8)}@paycrew.io`,
          narration: `PayCrew ${dto.plan || 'STARTER'} Subscription`,
          redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/onboarding/company?status=success&ref=${ref}&plan=${dto.plan || 'STARTER'}`,
        });
        checkoutUrl = checkout.checkoutUrl;
      }

      return { reference: ref, amount, currency, paymentMethod: dto.paymentMethod, checkoutUrl };
    }

    const ramp = this.rampFactory.getProvider(company.activeRampProvider || RampProviderType.QUIDAX);
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
    if (plan) company.subscriptionPlan = (plan as SubscriptionPlan) || company.subscriptionPlan;
    company.subscriptionStatus = SubscriptionStatus.ACTIVE;
    return this.companyRepo.save(company);
  }

  async getAllPlansAdmin(): Promise<SubscriptionPlanEntity[]> {
    return this.planRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async updatePlanAdmin(id: string, dto: Partial<AdminUpsertPlanDto>): Promise<SubscriptionPlanEntity> {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    Object.assign(plan, dto);
    return this.planRepo.save(plan);
  }
}
