/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiInstance } from '@frourio-demo/server/api/$api';
import type {
  MaybeUndefined,
  Dispatch,
  DataTableApi,
  ApiOptions,
  ApiResponse,
  ApiType,
  FallbackType,
} from '@frourio-demo/types';
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

export const handleAuthError = async <B, API extends ApiType<B>, F extends FallbackType<API>>(
  dispatch: Dispatch,
  fallback: F,
  api: API,
  ...option: ApiOptions<API>
): Promise<ApiResponse<API> | MaybeUndefined<F>> | never => {
  try {
    const result = await api(...option);
    return result.body as ApiResponse<API>;
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

        return fallback as MaybeUndefined<F>;
      }

      if (error.response && 500 === error.response.status && 'No Admin found' === error.response.data?.message) {
        logout(dispatch);
        if (!fallback) {
          throw error;
        }

        return fallback as MaybeUndefined<F>;
      }
    }

    if (!fallback) {
      throw error;
    }

    /* istanbul ignore next */
    setError(dispatch, error.response?.data?.message ?? error.message);
    return fallback as MaybeUndefined<F>;
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
