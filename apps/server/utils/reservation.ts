import type { QrInfo } from '$/types';
import { randomBytes, randomInt, scryptSync, createCipheriv, createDecipheriv } from 'crypto';
import { CRYPTO_PASS, CRYPTO_SALT, CRYPTO_ALGO } from '$/utils/env';
import { logger } from '$/service/logging';
import { ROOM_KEY_DIGITS } from '@frourio-demo/constants';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('');
export const generateCode = (): string => randomBytes(16).reduce((acc, value) => acc + chars[(value % 32)], '');
export const generateRoomKey = (): string => `${'0'.repeat(ROOM_KEY_DIGITS)}${randomInt(0, 10000)}`.slice(-ROOM_KEY_DIGITS);
export const encryptQrInfo = (info: QrInfo): string => {
  const key = scryptSync(CRYPTO_PASS, CRYPTO_SALT, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(CRYPTO_ALGO, key, iv);
  return Buffer.from(JSON.stringify({
    data: Buffer.concat([cipher.update(JSON.stringify(info)), cipher.final()]),
    iv,
  })).toString('base64');
};
export const decryptQrInfo = (encrypted: string): QrInfo | undefined => {
  try {
    const { data, iv } = JSON.parse(Buffer.from(encrypted, 'base64').toString());
    const key = scryptSync(CRYPTO_PASS, CRYPTO_SALT, 32);
    const decipher = createDecipheriv(CRYPTO_ALGO, key, Buffer.from(iv.data));
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data.data)), decipher.final()]).toString()) as QrInfo;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
