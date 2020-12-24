import aspida from '@aspida/axios';
import type { AspidaResponse } from 'aspida';
import api from '$/api/$api';
import { AxiosError } from 'axios';

const clients: { [key: string]: ReturnType<typeof api> } = {};

export const getClient = (withCredentials = true) => {
  const key = `${withCredentials}`;
  if (!(key in clients)) {
    clients[key] = api(aspida(undefined, {
      withCredentials,
    }));
  }

  return clients[key];
};

const isAxiosError = (target: any): target is AxiosError => {
  return typeof target === 'object' &&
    'config' in target &&
    'request' in target &&
    'response' in target;
};

export const handleAuthError = async <T, U, V, O>(
  dispatch: ((value: { type: string; [key: string]: any }) => void),
  fallback: Partial<T>,
  api: (option?: O) => Promise<AspidaResponse<T, U, V>>,
  option?: O,
): Promise<Partial<T>> | never => {
  try {
    const result = await api(option);
    console.log(result);

    return result.body;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && 401 === error.response.status) {
        dispatch({ type: 'PAGE', page: 'logout' });
        return fallback;
      }
    }

    throw error;
  }
};
