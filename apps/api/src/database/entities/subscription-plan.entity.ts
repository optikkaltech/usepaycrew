import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionPlan } from '@paycrew/shared-types';

@Entity('subscription_plans')
export class SubscriptionPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    unique: true,
  })
  code: SubscriptionPlan;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  badge: string | null;

  @Column({ type: 'int', default: 10 })
  baseWorkers: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  basePriceNgn: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  basePriceUsd: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  extraWorkerRateNgn: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  extraWorkerRateUsd: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  features: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isRecommended: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
