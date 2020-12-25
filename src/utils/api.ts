import aspida from '@aspida/axios';
import type { AspidaResponse } from 'aspida';
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
  fallback: Partial<T>,
  api: API,
  ...option: Parameters<API>
): Promise<Partial<T>> | never => {
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
    }

    setError(dispatch, error.message);

    throw error;
  }
};
