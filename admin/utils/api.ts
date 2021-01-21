/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AspidaResponse } from 'aspida';
import type { ApiInstance } from '$/api/$api';
import type { MaybeUndefined } from '~/types';
import type { Dispatch } from '~/store';
import aspida from '@aspida/axios';
import { AxiosError } from 'axios';
import { singular } from 'pluralize';
import api from '$/api/$api';
import { logout, setError } from '~/utils/actions';

export const client = api(aspida());

export const isAxiosError = (target: any): target is AxiosError => {
  return typeof target === 'object' &&
    'config' in target &&
    'request' in target &&
    'response' in target;
};

export const handleAuthError = async <T, U, V, API extends (...args: Array<any>) => Promise<AspidaResponse<T, U, V>>>(
  dispatch: Dispatch,
  fallback: T,
  api: API,
  ...option: Parameters<API>
): Promise<T | MaybeUndefined<T>> | never => {
  try {
    const result = await api(...option);
    return result.body;
  } catch (error) {
    console.log(error);
    /* istanbul ignore next */
    if (isAxiosError(error)) {
      console.log(error.response);
      if (error.response && 401 === error.response.status) {
        setError(dispatch, error.response.data?.message);
        if (error.response.data?.tokenExpired) {
          logout(dispatch);
        }

        if (!fallback) {
          /* istanbul ignore next */
          return undefined as MaybeUndefined<T>;
        }

        return fallback;
      }

      /* istanbul ignore next */
      if (error.response) {
        setError(dispatch, error.response.data?.message);
        throw error;
      }
    }

    /* istanbul ignore next */
    setError(dispatch, error.message);
    /* istanbul ignore next */
    throw error;
  }
};

export type DataTableApi = {
  get: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  post: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  detail: (id: number) => {
    patch: (option?: any) => Promise<AspidaResponse<any, any, any>>;
    delete: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  }
};
export type DataTableApiModels = {
  [key in keyof ApiInstance]: ApiInstance[key] extends {
    get,
    post,
  } ? key : never
}[keyof ApiInstance]
export const getDataTableApi = (model: DataTableApiModels): DataTableApi => ({
  ...client[model],
  detail: id => ({
    patch: client[model][`_${singular(model)}Id`](id).patch,
    delete: client[model][`_${singular(model)}Id`](id).delete,
  }),
});

export const processUpdateData = <T extends Partial<{
  updatedAt,
  createdAt,
}>>(data: T): Omit<T, 'updatedAt' | 'createdAt'> => {
  delete data.updatedAt;
  delete data.createdAt;
  return data;
};
