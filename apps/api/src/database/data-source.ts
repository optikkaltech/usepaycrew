import { DataSource, DataSourceOptions } from 'typeorm';
import {
  CompanyEntity,
  UserEntity,
  WorkerEntity,
  KycCheckEntity,
  PayoutMethodEntity,
  LedgerEntryEntity,
  PaymentEntity,
  ContractEntity,
  AuditLogEntity,
  SubscriptionPlanEntity,
  CompanyWalletEntity,
} from './entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'paycrew_dev',
  entities: [
    CompanyEntity,
    UserEntity,
    WorkerEntity,
    KycCheckEntity,
    PayoutMethodEntity,
    LedgerEntryEntity,
    PaymentEntity,
    ContractEntity,
    AuditLogEntity,
    SubscriptionPlanEntity,
    CompanyWalletEntity,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
