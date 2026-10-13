import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Currency, PaymentStatus } from '@paycrew/shared-types';
import { CompanyEntity } from './company.entity';
import { WorkerEntity } from './worker.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => CompanyEntity, (company) => company.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'uuid' })
  workerId: string;

  @ManyToOne(() => WorkerEntity, (worker) => worker.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerEntity;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: string;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: Currency;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  feeAmount: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  totalCharged: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.CREATED,
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  providerReference: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  idempotencyKey: string;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledFor: Date | null;

  @Column({ type: 'text', nullable: true })
  failureReason: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
