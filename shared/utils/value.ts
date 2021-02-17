/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Primitive } from '@frourio-demo/types';
import { toFullWidth, toHalfWidth } from '@technote-space/imi-moji-converter';

export const getReplaceVariables = (variables: Record<string, any>, getKey?: (key: string) => string): Record<string, Primitive> =>
  Object.fromEntries(
    Object.entries(variables).filter(([, value]) =>
      value === undefined ||
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number',
    ).map(([key, value]) => [getKey ? getKey(key) : key, value]),
  );

export const normalizeHalfFull = <T extends Record<string, any>>(object: T, options?: { toFull?: string[]; toHalf?: string[] }): T => {
  const convert = (key: string, value: any) => {
    if (typeof value === 'string' || typeof value === 'number') {
      if (options?.toFull && options.toFull.includes(key)) {
        return toFullWidth(`${value}`);
      }
      if (options?.toHalf && options.toHalf.includes(key)) {
        return toHalfWidth(`${value}`);
      }
    }

    return value;
  };

  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, convert(key, value)])) as T;
};
