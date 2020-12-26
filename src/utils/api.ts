import type { AspidaResponse } from 'aspida';
import type { ApiType } from '~/components/DataTable';
import type { ApiInstance } from '$/api/$api';
import aspida from '@aspida/axios';
import { AxiosError } from 'axios';
import api from '$/api/$api';
import { changePage, setError } from '~/utils/actions';

export const client = api(aspida());

const isAxiosError = (target: any): target is AxiosError => {
  return typeof target === 'object' &&
    'config' in target &&
    'request' in target &&
    'response' in target;
};

export const handleAuthError = async <T, U, V, API extends (...args: Array<any>) => Promise<AspidaResponse<T, U, V>>>(
  dispatch: ((value: { type: string; [key: string]: any }) => void),
  fallback: T,
  api: API,
  ...option: Parameters<API>
): Promise<T> | never => {
  try {
    const result = await api(...option);
    console.log(result);

    return result.body;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      console.log(error.response);
      if (error.response && (400 === error.response.status || 401 === error.response.status)) {
        setError(dispatch, error.response.data.message);
        changePage(dispatch, 'logout');
        return fallback;
      }

      if (error.response) {
        setError(dispatch, error.response.data.message);
        throw error;
      }
    }

    setError(dispatch, error.message);
    throw error;
  }
};

export type ApiModels = {
  [key in keyof ApiInstance]: ApiInstance[key] extends {
    get,
    post,
  } ? key : never
}[keyof ApiInstance]
export const getDataTableApi = <T extends string>(model: ApiModels): ApiType => ({
  ...client[model],
  detail: id => ({
    patch: client[`_${model}Id`].patch,
    delete: client[`_${model}Id`].delete,
  }),
});
