import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import { depend } from 'velona';
import { isAfter, isBefore, set, startOfDay, endOfDay } from 'date-fns';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { CRYPTO_ALGO, CRYPTO_PASS, CRYPTO_SALT } from '$/config/env';
import { logger } from '$/utils/logger';

export type QrInfo = {
  reservationId: number;
  roomId: number | null;
  key: string;
}

export const isValidCheckinDateRange = depend(
  { isAfter, isBefore },
  ({ isAfter, isBefore }, checkin: Date, checkout: Date, now: Date): boolean => {
    const values = { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 };
    return isAfter(now, set(checkin, values)) && isBefore(now, set(checkout, values));
  },
);
export const getValidReservation = depend(
  { isValidCheckinDateRange },
  async({ isValidCheckinDateRange }, reservationRepository: Pick<IReservationRepository, 'list'>, roomId: number, now: Date): Promise<Reservation | undefined> => (await reservationRepository.list({
    where: {
      roomId,
      checkin: {
        lt: endOfDay(now),
      },
      checkout: {
        gt: startOfDay(now),
      },
      status: {
        in: ['reserved', 'checkin'],
      },
    },
  })).find(reservation => isValidCheckinDateRange(reservation.checkin, reservation.checkout, now)),
);

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
