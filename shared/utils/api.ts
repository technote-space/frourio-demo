/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AspidaResponse } from 'aspida';
import type { MaybeUndefined } from '@/types';
import type { AxiosError } from 'axios';

export const isAxiosError = (target: any): target is AxiosError => {
  return typeof target === 'object' &&
    'config' in target &&
    'request' in target &&
    'response' in target;
};

export const handleApiError = async <T, U, V, API extends (...args: Array<any>) => Promise<AspidaResponse<T, U, V>>>(
  onError: (error: Error) => T | never,
  api: API,
  ...option: Parameters<API>
): Promise<T | MaybeUndefined<T>> | never => {
  try {
    const result = await api(...option);
    return result.body;
  } catch (error) {
    console.log(error);
    return onError(error);
  }
};

export const processUpdateData = <T extends Partial<{
  updatedAt,
  createdAt,
}>>(data: T): Omit<T, 'updatedAt' | 'createdAt'> => {
  delete data.updatedAt;
  delete data.createdAt;
  return data;
};
