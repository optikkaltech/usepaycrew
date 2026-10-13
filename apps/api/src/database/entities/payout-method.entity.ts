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
import { PayoutMethodType } from '@paycrew/shared-types';
import { WorkerEntity } from './worker.entity';

@Entity('payout_methods')
export class PayoutMethodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  workerId: string;

  @ManyToOne(() => WorkerEntity, (worker) => worker.payoutMethods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerEntity;

  @Column({
    type: 'enum',
    enum: PayoutMethodType,
  })
  type: PayoutMethodType;

  @Column({ type: 'varchar', length: 255 })
  accountReference: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankCode: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  bankName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  network: string | null;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
