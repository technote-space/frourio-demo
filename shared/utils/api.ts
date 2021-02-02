/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from 'axios';

export const isAxiosError = (target: any): target is AxiosError => {
  return typeof target === 'object' &&
    'config' in target &&
    'request' in target &&
    'response' in target;
};

export const processUpdateData = <T extends Partial<{
  updatedAt,
  createdAt,
}>>(data: T): Omit<T, 'updatedAt' | 'createdAt'> => {
  delete data.updatedAt;
  delete data.createdAt;
  return data;
};
