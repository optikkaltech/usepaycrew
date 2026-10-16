import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionPlans1792041000000 implements MigrationInterface {
  name = 'CreateSubscriptionPlans1792041000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscription_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" "public"."companies_subscriptionplan_enum" NOT NULL,
        "name" character varying(100) NOT NULL,
        "badge" character varying(50),
        "baseWorkers" integer NOT NULL DEFAULT 10,
        "basePriceNgn" numeric(12,2) NOT NULL DEFAULT 0,
        "basePriceUsd" numeric(12,2) NOT NULL DEFAULT 0,
        "extraWorkerRateNgn" numeric(12,2) NOT NULL DEFAULT 0,
        "extraWorkerRateUsd" numeric(12,2) NOT NULL DEFAULT 0,
        "description" text,
        "features" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "isRecommended" boolean NOT NULL DEFAULT false,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_subscription_plans_code" UNIQUE ("code"),
        CONSTRAINT "PK_subscription_plans" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plans"`);
  }
}
