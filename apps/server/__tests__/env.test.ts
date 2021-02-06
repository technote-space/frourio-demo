import { testEnv } from './utils';

jest.mock('dotenv');

describe('env', () => {
  testEnv();

  it('should use process.env value', () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.PORT = '123';
    process.env.SERVER_ADDRESS = '0.0.0.0';
    process.env.BASE_PATH = '/api/test';
    process.env.API_ORIGIN = 'http://example.com';
    process.env.API_URL = 'https://example.com/abc/';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../service/env');
    expect(env.JWT_SECRET).toBe('test-secret');
    expect(env.SERVER_PORT).toBe(123);
    expect(env.URL_PORT).toBe(':123');
    expect(env.SERVER_ADDRESS).toBe('0.0.0.0');
    expect(env.BASE_PATH).toBe('/api/test');
    expect(env.API_ORIGIN).toBe('http://example.com');
    expect(env.API_URL).toBe('https://example.com/abc/api/test');
  });

  it('should use fallback value', () => {
    delete process.env.JWT_SECRET;
    delete process.env.PORT;
    delete process.env.SERVER_PORT;
    delete process.env.SERVER_ADDRESS;
    delete process.env.BASE_PATH;
    delete process.env.API_ORIGIN;
    delete process.env.API_URL;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../service/env');
    expect(env.JWT_SECRET).toBe('');
    expect(env.SERVER_PORT).toBe(8080);
    expect(env.URL_PORT).toBe(':8080');
    expect(env.SERVER_ADDRESS).toBe('localhost');
    expect(env.BASE_PATH).toBe('');
    expect(env.API_ORIGIN).toBe('http://localhost');
    expect(env.API_URL).toBe('http://localhost:8080');
  });

  it('should return empty URL_PORT', () => {
    delete process.env.PORT;
    process.env.SERVER_PORT = '80';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../service/env');
    expect(env.URL_PORT).toBe('');
  });
});
