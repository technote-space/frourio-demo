import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const SERVER_PORT = +(process.env.PORT ?? process.env.SERVER_PORT ?? '8080'); // consider heroku
const SERVER_ADDRESS = process.env.SERVER_ADDRESS ?? 'localhost'; // consider heroku
const BASE_PATH = process.env.BASE_PATH ?? '';
const API_ORIGIN = process.env.API_ORIGIN ?? '';
const URL_PORT = SERVER_PORT === 80 ? '' : `:${SERVER_PORT}`;
const API_URL = `${(process.env.API_URL ?? `${API_ORIGIN}${URL_PORT}`).replace(/\/$/, '')}${BASE_PATH}`;

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? '';

export {
  JWT_SECRET,
  AUTH0_DOMAIN,
  SERVER_PORT, SERVER_ADDRESS, BASE_PATH, API_ORIGIN, URL_PORT, API_URL,
};
