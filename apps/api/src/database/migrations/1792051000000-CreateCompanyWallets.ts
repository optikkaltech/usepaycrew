import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanyWallets1792051000000 implements MigrationInterface {
  name = 'CreateCompanyWallets1792051000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "company_wallets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "companyId" uuid NOT NULL,
        "currency" character varying(20) NOT NULL,
        "network" character varying(50) NOT NULL,
        "address" character varying(255) NOT NULL,
        "destinationTag" character varying(100),
        "qrCode" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_company_wallets" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_company_wallets_currency_network" UNIQUE ("companyId", "currency", "network"),
        CONSTRAINT "FK_company_wallets_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    // Purge any legacy mocked deposit addresses from existing company records
    await queryRunner.query(`
      UPDATE "companies"
      SET "depositWalletAddress" = NULL
      WHERE "depositWalletAddress" LIKE '%0x71C8%' OR "depositWalletAddress" LIKE '%TYDzsYUE%';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "company_wallets"`);
  }
}
