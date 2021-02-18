import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? '';
const CRYPTO_PASS = process.env.CRYPTO_PASS ?? '';
const CRYPTO_SALT = process.env.CRYPTO_SALT ?? '';
const CRYPTO_ALGO = process.env.CRYPTO_ALGO ?? '';
const STRIPE_SECRET = process.env.STRIPE_SECRET ?? '';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? '';

const SERVER_PORT = +(process.env.PORT ?? process.env.SERVER_PORT ?? '8080'); // consider heroku
const SERVER_ADDRESS = process.env.SERVER_ADDRESS ?? 'localhost'; // consider heroku
const BASE_PATH = process.env.BASE_PATH ?? '';
const API_ORIGIN = process.env.API_ORIGIN ?? `http://${SERVER_ADDRESS}`;
const URL_PORT = SERVER_PORT === 80 ? '' : `:${SERVER_PORT}`;
const API_URL = `${(process.env.API_URL ?? `${API_ORIGIN}${URL_PORT}`).replace(/\/$/, '')}${BASE_PATH}`;
const FRONT_URL = (process.env.FRONT_URL ?? '').replace(/\/$/, '');

const SMTP_HOST = process.env.SMTP_HOST ?? '';
const SMTP_PORT = +(process.env.SMTP_PORT ?? '587');
const SMTP_SECURE = !!process.env.SMTP_SECURE;
const SMTP_USER = process.env.SMTP_USER ?? '';
const SMTP_PASS = process.env.SMTP_PASS ?? '';
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;
const SMTP_BCC = (process.env.SMTP_BCC ?? '').split(',').filter(value => value);

export {
  JWT_SECRET, AUTH0_DOMAIN, CRYPTO_PASS, CRYPTO_SALT, CRYPTO_ALGO, STRIPE_SECRET, SLACK_WEBHOOK_URL,
  SERVER_PORT, SERVER_ADDRESS, BASE_PATH, API_ORIGIN, URL_PORT, API_URL, FRONT_URL,
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_BCC,
};
