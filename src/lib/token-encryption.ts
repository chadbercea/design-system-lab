/**
 * Token encryption/decryption utilities using AES-256-CBC
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

/**
 * Get encryption key from environment
 * Key must be exactly 32 bytes for AES-256
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }

  // Convert base64 secret to 32-byte buffer
  const key = Buffer.from(secret, 'base64');

  if (key.length !== 32) {
    throw new Error('AUTH_SECRET must be exactly 32 bytes (use: openssl rand -base64 32)');
  }

  return key;
}

/**
 * Encrypt a token using AES-256-CBC
 * Returns format: "iv:encryptedData" (both in hex)
 */
export function encryptToken(token: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(16); // AES block size is 16 bytes

    const cipher = createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV and encrypted data separated by colon
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Token encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a token encrypted with encryptToken
 * Expects format: "iv:encryptedData" (both in hex)
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const key = getEncryptionKey();
    const [ivHex, encrypted] = encryptedToken.split(':');

    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted token format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Validate that a token can be encrypted and decrypted
 * Useful for testing encryption setup
 */
export function validateEncryption(testToken: string = 'test-token-123'): boolean {
  try {
    const encrypted = encryptToken(testToken);
    const decrypted = decryptToken(encrypted);
    return decrypted === testToken;
  } catch (error) {
    console.error('Encryption validation failed:', error);
    return false;
  }
}
