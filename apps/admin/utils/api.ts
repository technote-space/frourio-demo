/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AspidaResponse } from 'aspida';
import type { ApiInstance } from '@frourio-demo/server/api/$api';
import type { MaybeUndefined, Dispatch, DataTableApi } from '@frourio-demo/types';
import aspida from '@aspida/axios';
import { singular } from 'pluralize';
import api from '@frourio-demo/server/api/$api';
import { isAxiosError } from '@frourio-demo/utils/api';
import { logout, setError, onRefreshToken } from '~/utils/actions';

const apiClient = api(aspida());
export const client = {
  ...apiClient.admin,
  login: apiClient.login.admin,
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
