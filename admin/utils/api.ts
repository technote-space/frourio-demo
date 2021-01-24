/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AspidaResponse } from 'aspida';
import type { ApiInstance } from '$/api/$api';
import type { MaybeUndefined } from '~/types';
import type { Dispatch } from '~/store';
import aspida from '@aspida/axios';
import { AxiosError } from 'axios';
import { singular } from 'pluralize';
import api from '$/api/$api';
import { logout, setError, onRefreshToken } from '~/utils/actions';

const apiClient = api(aspida());
export const client = {
  ...apiClient.admin,
  login: apiClient.login.admin,
};

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
        if (error.response.data?.tokenExpired) {
          setError(dispatch, error.response.data?.message);
          logout(dispatch);
        } else {
          setError(dispatch, error.response.data?.message ?? error.response.config.method?.toUpperCase() === 'GET' ? '' : 'その操作をする権限がありません。');
          onRefreshToken(dispatch);
        }

        if (!fallback) {
          throw error;
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
  [key in keyof ApiInstance['admin']]: ApiInstance['admin'][key] extends {
    get,
    post,
  } ? key : never
}[keyof ApiInstance['admin']]
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
