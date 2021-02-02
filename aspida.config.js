require('dotenv').config({ path: 'apps/server/.env' });

module.exports = {
  input: 'apps/server/api',
  baseURL: `${process.env.API_ORIGIN || ''}${!process.env.SERVER_PORT || process.env.SERVER_PORT === '80' ? '' : `:${process.env.SERVER_PORT}`}${process.env.BASE_PATH || ''}`,
};
