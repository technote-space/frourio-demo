import { randomBytes } from 'crypto';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('');
export const generateCode = (): string => randomBytes(12).reduce((acc, value) => acc + chars[(value % 32)], '');
