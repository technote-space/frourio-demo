/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeUndefined, Dispatch, ApiType, ApiResponse, ApiOptions, FallbackType } from '@frourio-demo/types';
import aspida from '@aspida/axios';
import api from '@frourio-demo/server/api/$api';
import { setError } from '#/utils/actions';

const apiClient = api(aspida());
export const client = apiClient.lock;

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
    if (!fallback) {
      throw error;
    }

    /* istanbul ignore next */
    setError(dispatch, error.response?.data?.message ?? error.message);
    return fallback as MaybeUndefined<F>;
  }
};
