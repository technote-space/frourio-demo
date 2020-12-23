import aspida from '@aspida/axios';
import api from '$/api/$api';

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
