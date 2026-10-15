import { z } from 'zod';

export const envSchema = z.object({
  // Runtime & Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_PREFIX: z.string().default('api'),

  // PostgreSQL Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('paycrew_dev'),
  DATABASE_URL: z.string().optional(),

  // JWT & Security
  JWT_SECRET: z.string().min(16).default('paycrew_jwt_super_secret_key_2026'),
  JWT_REFRESH_SECRET: z.string().min(16).default('paycrew_refresh_super_secret_key_2026'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  KYC_ENCRYPTION_KEY: z.string().min(32).default('01234567890123456789012345678901'),

  // Google OAuth 2.0
  GOOGLE_CLIENT_ID: z.string().default('paycrew-google-client-id.apps.googleusercontent.com'),
  GOOGLE_CLIENT_SECRET: z.string().default('GOCSPX-test-google-client-secret-2026'),
  GOOGLE_CALLBACK_URL: z.string().default('http://localhost:4000/api/auth/google/callback'),

  // Quidax Ramp (Custodial On/Off-Ramp & Widget)
  QUIDAX_RAMP_BASE_URL: z.string().default('https://ramp-be.quidax.io'),
  QUIDAX_RAMP_PRIVATE_KEY: z.string().default('sk_test_quidax_ramp_key_2026'),
  QUIDAX_RAMP_PUBLIC_KEY: z.string().default('pub_test_quidax_ramp_key_2026'),
  QUIDAX_RAMP_WEBHOOK_SECRET: z.string().default('test_quidax_ramp_webhook_secret_2026'),

  // Quidax Exchange (Market Tickers & OTC Rates)
  QUIDAX_BASE_URL: z.string().default('https://app.quidax.com/api/v1'),
  QUIDAX_SECRET_KEY: z.string().default('sec_test_quidax_key_2026'),
  QUIDAX_PUBLIC_KEY: z.string().default('pub_test_quidax_key_2026'),
  QUIDAX_WEBHOOK_SECRET: z.string().default('test_quidax_webhook_secret_2026'),

  // Korapay (Virtual NUBANs & Bank Settlement)
  KORAPAY_BASE_URL: z.string().default('https://api.korapay.com/merchant/api'),
  KORAPAY_SECRET_KEY: z.string().default('sk_test_korapay_secret_key_2026'),
  KORAPAY_PUBLIC_KEY: z.string().default('pk_test_korapay_public_key_2026'),
  KORAPAY_WEBHOOK_SECRET: z.string().default('test_korapay_webhook_secret_2026'),

  // Prembly / Primebly (KYB & BVN/NIN Verification)
  PREMBLY_BASE_URL: z.string().default('https://api.prembly.com'),
  PREMBLY_API_KEY: z.string().default('test_prembly_api_key_2026'),
  PREMBLY_APP_ID: z.string().default('test_prembly_app_id_2026'),

  // MailerSend (Transactional Emails)
  MAILERSEND_API_KEY: z.string().default('mlsn.test_mailersend_api_key_2026'),
  MAILERSEND_FROM_EMAIL: z.string().default('noreply@paycrew.io'),
  MAILERSEND_FROM_NAME: z.string().default('PayCrew'),

  // YellowCard (Alternative Stablecoin Ramp)
  YELLOWCARD_BASE_URL: z.string().default('https://api.yellowcard.io/business/v1'),
  YELLOWCARD_API_KEY: z.string().default('test_yellowcard_api_key_2026'),
  YELLOWCARD_WEBHOOK_SECRET: z.string().default('test_yellowcard_webhook_secret_2026'),

  // Smile ID & Dojah (Alternative KYC)
  SMILE_ID_PARTNER_ID: z.string().default('sandbox_partner'),
  SMILE_ID_API_KEY: z.string().default('test_smile_id_key'),
  DOJAH_API_KEY: z.string().default('test_dojah_api_key'),
  DOJAH_APP_ID: z.string().default('test_dojah_app_id'),

  // Redis & Background Tasks
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Blockchain RPC Rails
  BASE_RPC_URL: z.string().default('https://mainnet.base.org'),
  TRON_RPC_URL: z.string().default('https://api.trongrid.io'),
});

export type EnvConfig = z.infer<typeof envSchema>;
