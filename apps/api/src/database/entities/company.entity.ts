import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  CompanyOnboardingStep,
  KycProviderType,
  RampProviderType,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@paycrew/shared-types';
import { UserEntity } from './user.entity';
import { WorkerEntity } from './worker.entity';
import { PaymentEntity } from './payment.entity';
import { LedgerEntryEntity } from './ledger-entry.entity';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrationNumber: string | null;

  @Column({ type: 'varchar', length: 10, default: 'NG' })
  country: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.STARTER,
  })
  subscriptionPlan: SubscriptionPlan;

  @Column({ type: 'timestamptz', nullable: true })
  subscriptionExpiresAt: Date | null;

  @Column({
    type: 'enum',
    enum: CompanyOnboardingStep,
    default: CompanyOnboardingStep.PROFILE,
  })
  onboardingStep: CompanyOnboardingStep;

  @Column({
    type: 'enum',
    enum: KycProviderType,
    default: KycProviderType.MOCK,
  })
  activeKycProvider: KycProviderType;

  @Column({
    type: 'enum',
    enum: RampProviderType,
    default: RampProviderType.MOCK,
  })
  activeRampProvider: RampProviderType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessAddress: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  taxId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  virtualAccountBank: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  virtualAccountNumber: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  depositWalletAddress: string | null;

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity[];

  @OneToMany(() => WorkerEntity, (worker) => worker.company)
  workers: WorkerEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.company)
  payments: PaymentEntity[];

  @OneToMany(() => LedgerEntryEntity, (entry) => entry.company)
  ledgerEntries: LedgerEntryEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
