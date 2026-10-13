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
import { KycCheckType, KycStatus } from '@paycrew/shared-types';
import { WorkerEntity } from './worker.entity';

@Entity('kyc_checks')
export class KycCheckEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  workerId: string;

  @ManyToOne(() => WorkerEntity, (worker) => worker.kycChecks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerEntity;

  @Column({ type: 'varchar', length: 50, default: 'DOJAH' })
  provider: string;

  @Column({
    type: 'enum',
    enum: KycCheckType,
  })
  checkType: KycCheckType;

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  status: KycStatus;

  @Column({ type: 'text', nullable: true })
  encryptedData: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  maskedIdentifier: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reasonCode: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  providerReference: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
