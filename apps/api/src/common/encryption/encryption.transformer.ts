import { ValueTransformer } from 'typeorm';
import { EncryptionService } from './encryption.service';

/**
 * TypeORM ValueTransformer to automatically encrypt data at rest
 * and decrypt on read, with backward compatibility for plain text.
 */
export const encryptionTransformer: ValueTransformer = {
  to(value: string | null | undefined): string | null | undefined {
    if (!value) return value;
    return EncryptionService.encrypt(value);
  },
  from(value: string | null | undefined): string | null | undefined {
    if (!value) return value;
    return EncryptionService.decrypt(value);
  },
};
