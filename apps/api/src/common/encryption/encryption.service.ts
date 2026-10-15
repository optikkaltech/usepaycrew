import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly PREFIX = 'enc:';

  private static getKey(): Buffer {
    const rawKey =
      process.env.FIELD_ENCRYPTION_KEY ||
      process.env.KYC_ENCRYPTION_KEY ||
      '01234567890123456789012345678901';
    return Buffer.from(rawKey.padEnd(32).slice(0, 32));
  }

  /**
   * Encrypts plaintext using AES-256-GCM.
   * Format: enc:<iv_hex>:<auth_tag_hex>:<ciphertext_hex>
   */
  static encrypt(plainText: string | null | undefined): string {
    if (!plainText) return plainText as string;
    if (plainText.startsWith(this.PREFIX)) return plainText;

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.getKey(), iv);

    let ciphertext = cipher.update(plainText, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${this.PREFIX}${iv.toString('hex')}:${authTag}:${ciphertext}`;
  }

  /**
   * Decrypts AES-256-GCM ciphertext.
   * If not prefixed with `enc:`, safely returns the original text.
   */
  static decrypt(cipherText: string | null | undefined): string {
    if (!cipherText || typeof cipherText !== 'string') return cipherText as string;
    if (!cipherText.startsWith(this.PREFIX)) return cipherText;

    const parts = cipherText.slice(this.PREFIX.length).split(':');
    if (parts.length !== 3) {
      throw new Error(
        `Invalid encrypted data format: expected enc:iv:tag:ciphertext, got ${cipherText.slice(0, 24)}...`,
      );
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    try {
      const decipher = crypto.createDecipheriv(this.ALGORITHM, this.getKey(), iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err: any) {
      throw new Error(
        `Field decryption failed (data corrupted, tampered, or invalid encryption key): ${err.message}`,
      );
    }
  }

  encrypt(plainText: string): string {
    return EncryptionService.encrypt(plainText);
  }

  decrypt(cipherText: string): string {
    return EncryptionService.decrypt(cipherText);
  }
}
