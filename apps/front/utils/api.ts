/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeUndefined, Dispatch, ApiType, ApiResponse, ApiOptions, FallbackType } from '@frourio-demo/types';
import type { ValidationError } from 'class-validator';
import aspida from '@aspida/axios';
import api from '@frourio-demo/server/api/$api';
import { isAxiosError } from '@frourio-demo/utils/api';
import { logout, setError, onRefreshToken } from '^/utils/actions';

const apiClient = api(aspida());
export const client = {
  ...apiClient.front,
  stripe: apiClient.stripe,
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

      if (error.response && 500 === error.response.status && 'No Guest found' === error.response.data?.message) {
        logout(dispatch);
        onRefreshToken(dispatch);
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

export const processValidationError = (error: any): Record<string, string> => {
  if (isAxiosError(error) && error.response?.data) {
    const validationError = error.response.data as ValidationError[];
    return Object.assign({}, ...validationError.map(error => error.constraints ? {
      [error.property]: Object.values(error.constraints)[0],
    } : undefined));
  }

  return {};
};
