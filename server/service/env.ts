import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const SERVER_PORT = +(process.env.SERVER_PORT ?? '8080');
const BASE_PATH = process.env.BASE_PATH ?? '';
const API_ORIGIN = process.env.API_ORIGIN ?? '';

export { JWT_SECRET, SERVER_PORT, BASE_PATH, API_ORIGIN };
