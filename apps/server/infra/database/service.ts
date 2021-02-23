/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeUndefined } from '@/types';
import { randomBytes, randomInt } from 'crypto';
import { ROOM_KEY_DIGITS } from '@frourio-demo/constants';
import bcrypt from 'bcryptjs';

export const dropId = <T extends Record<string, any> & Partial<{ id: number; code: any; }>>(data: T): Omit<T, 'id'> => {
  delete data.id;
  delete data.code;
  return data;
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('');
export const generateCode = (): string => randomBytes(16).reduce((acc, value) => acc + chars[(value % 32)], '');
export const generateRoomKey = (): string => `${'0'.repeat(ROOM_KEY_DIGITS)}${randomInt(0, Math.pow(10, ROOM_KEY_DIGITS))}`.slice(-ROOM_KEY_DIGITS);

export const createHash = (data: string): string => bcrypt.hashSync(data, 10);
export const validateHash = (data: string, hash: string): boolean => bcrypt.compareSync(data, hash);
export const createAdminPasswordHash = <T extends { set?: string } | string | undefined>(password?: T): string | MaybeUndefined<T> => {
  if (password && typeof password === 'object') {
    return createAdminPasswordHash(password.set);
  }

  if (!password) {
    return undefined as MaybeUndefined<T>;
  }

  return createHash(password as string);
};

export const whereId = (id: number | undefined): { id?: number } => ({
  ...(id ? { id } : undefined),
});
