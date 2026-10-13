import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  Currency,
  PayFrequency,
  WorkerOnboardingStep,
  WorkerStatus,
} from '@paycrew/shared-types';
import { CompanyEntity } from './company.entity';
import { KycCheckEntity } from './kyc-check.entity';
import { PayoutMethodEntity } from './payout-method.entity';
import { ContractEntity } from './contract.entity';
import { PaymentEntity } from './payment.entity';

@Entity('workers')
export class WorkerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => CompanyEntity, (company) => company.workers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 10, default: 'NG' })
  country: string;

  @Column({ type: 'varchar', length: 150 })
  role: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  payAmount: string;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  payCurrency: Currency;

  @Column({
    type: 'enum',
    enum: PayFrequency,
    default: PayFrequency.MONTHLY,
  })
  payFrequency: PayFrequency;

  @Column({
    type: 'enum',
    enum: WorkerStatus,
    default: WorkerStatus.INVITED,
  })
  status: WorkerStatus;

  @Column({
    type: 'enum',
    enum: WorkerOnboardingStep,
    default: WorkerOnboardingStep.ACCOUNT,
  })
  onboardingStep: WorkerOnboardingStep;

  @Column({ type: 'varchar', length: 255, nullable: true })
  inviteToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  inviteExpiresAt: Date | null;

  @OneToMany(() => KycCheckEntity, (kyc) => kyc.worker)
  kycChecks: KycCheckEntity[];

  @OneToMany(() => PayoutMethodEntity, (pm) => pm.worker)
  payoutMethods: PayoutMethodEntity[];

  @OneToMany(() => ContractEntity, (contract) => contract.worker)
  contracts: ContractEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.worker)
  payments: PaymentEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
