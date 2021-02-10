/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Primitive } from '@frourio-demo/types';

export const getReplaceVariables = (variables: Record<string, any>, getKey?: (key: string) => string): Record<string, Primitive> =>
  Object.fromEntries(
    Object.entries(variables).filter(([, value]) =>
      value === undefined ||
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number',
    ).map(([key, value]) => [getKey ? getKey(key) : key, value]),
  );
