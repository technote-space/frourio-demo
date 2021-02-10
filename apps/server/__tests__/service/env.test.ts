import { testEnv } from '$/__tests__/utils';

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
    process.env.FRONT_URL = 'https://example.com/front/';
    process.env.SMTP_HOST = 'example.com';
    process.env.SMTP_PORT = '25';
    process.env.SMTP_SECURE = '';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_FROM = 'from';
    process.env.SMTP_BCC = 'bcc1,bcc2';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../../service/env');
    expect(env.JWT_SECRET).toBe('test-secret');
    expect(env.SERVER_PORT).toBe(123);
    expect(env.URL_PORT).toBe(':123');
    expect(env.SERVER_ADDRESS).toBe('0.0.0.0');
    expect(env.BASE_PATH).toBe('/api/test');
    expect(env.API_ORIGIN).toBe('http://example.com');
    expect(env.API_URL).toBe('https://example.com/abc/api/test');
    expect(env.FRONT_URL).toBe('https://example.com/front');
    expect(env.SMTP_HOST).toBe('example.com');
    expect(env.SMTP_PORT).toBe(25);
    expect(env.SMTP_SECURE).toBe(false);
    expect(env.SMTP_USER).toBe('user');
    expect(env.SMTP_PASS).toBe('pass');
    expect(env.SMTP_FROM).toBe('from');
    expect(env.SMTP_BCC).toEqual(['bcc1', 'bcc2']);
  });

  it('should use fallback value', () => {
    delete process.env.JWT_SECRET;
    delete process.env.PORT;
    delete process.env.SERVER_PORT;
    delete process.env.SERVER_ADDRESS;
    delete process.env.BASE_PATH;
    delete process.env.API_ORIGIN;
    delete process.env.API_URL;
    delete process.env.FRONT_URL;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_SECURE;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
    delete process.env.SMTP_BCC;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../../service/env');
    expect(env.JWT_SECRET).toBe('');
    expect(env.SERVER_PORT).toBe(8080);
    expect(env.URL_PORT).toBe(':8080');
    expect(env.SERVER_ADDRESS).toBe('localhost');
    expect(env.BASE_PATH).toBe('');
    expect(env.API_ORIGIN).toBe('http://localhost');
    expect(env.API_URL).toBe('http://localhost:8080');
    expect(env.FRONT_URL).toBe('');
    expect(env.SMTP_HOST).toBe('');
    expect(env.SMTP_PORT).toBe(587);
    expect(env.SMTP_SECURE).toBe(true);
    expect(env.SMTP_USER).toBe('');
    expect(env.SMTP_PASS).toBe('');
    expect(env.SMTP_FROM).toBe('');
    expect(env.SMTP_BCC).toEqual([]);
  });

  it('should return empty URL_PORT', () => {
    delete process.env.PORT;
    process.env.SERVER_PORT = '80';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../../service/env');
    expect(env.URL_PORT).toBe('');
  });

  it('should use smtp user', () => {
    delete process.env.SMTP_FROM;
    process.env.SMTP_USER = 'user';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../../service/env');
    expect(env.SMTP_FROM).toBe('user');
  });
});
