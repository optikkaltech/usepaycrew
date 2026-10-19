import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { EnvConfig, envSchema } from './env.schema';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const logger = new Logger('EnvConfig');

/**
 * Validates raw environment object against Zod schema.
 * Throws informative error in production or logs clear warnings in development.
 */
export function validateEnv(config: Record<string, unknown> = process.env): EnvConfig {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');

    const banner = [
      '=================================================================',
      '⚠️  ENVIRONMENT CONFIGURATION VALIDATION FAILED',
      '=================================================================',
      'The following environment variables are invalid or missing:',
      errorDetails,
      '-----------------------------------------------------------------',
      'Please check your .env file or deployment environment settings.',
      '=================================================================',
    ].join('\n');

    logger.error(banner);

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Application failed to start: Invalid environment configuration.\n${errorDetails}`);
    }

    // In non-production, return partial defaults so dev is never blocked
    logger.warn('Non-production environment: applying fallback defaults.');
    return envSchema.parse({});
  }

  return parsed.data;
}

/**
 * Singleton typed environment config object.
 * Safe to import and use anywhere in the application.
 *
 * Example:
 * ```ts
 * import { env } from '@/config';
 * console.log(env.PORT, env.QUIDAX_SECRET_KEY);
 * ```
 */
export const env: EnvConfig = validateEnv(process.env);
