import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { CRYPTO_ALGO, CRYPTO_PASS, CRYPTO_SALT } from '$/config/env';
import { logger } from '$/utils/logger';

export type QrInfo = {
  reservationId: number;
  roomId: number | null;
  key: string;
}

const bufferToArray = (buffer: Buffer) => JSON.parse(JSON.stringify(buffer)).data;
export const encryptQrInfo = (info: QrInfo): string => {
  const key = scryptSync(CRYPTO_PASS, CRYPTO_SALT, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(CRYPTO_ALGO, key, iv);
  return Buffer.from(JSON.stringify({
    data: bufferToArray(Buffer.concat([cipher.update(JSON.stringify(info)), cipher.final()])),
    iv: bufferToArray(iv),
  })).toString('base64');
};
export const decryptQrInfo = (encrypted: string): QrInfo | undefined => {
  try {
    const { data, iv } = JSON.parse(Buffer.from(encrypted, 'base64').toString());
    const key = scryptSync(CRYPTO_PASS, CRYPTO_SALT, 32);
    const decipher = createDecipheriv(CRYPTO_ALGO, key, Buffer.from(iv));
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data)), decipher.final()]).toString()) as QrInfo;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
