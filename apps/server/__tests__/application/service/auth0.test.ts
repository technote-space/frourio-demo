import { getPromiseLikeItem } from '$/__tests__/utils';
import { verifyCode } from '$/application/service/auth0';
import * as env from '$/config/env';

describe('verifyCode', () => {
  it('should return auth info', async() => {
    Object.defineProperty(env, 'AUTH0_DOMAIN', { value: 'example.com' });
    const mock = jest.fn(() => getPromiseLikeItem({
      ok: true, json: () => getPromiseLikeItem({
        email: 'test@example.com',
        sub: 'sub',
      }),
    }));
    expect(await verifyCode.inject({
      fetch: mock,
    })('token')).toEqual({
      email: 'test@example.com',
      auth0Sub: 'sub',
    });
    expect(mock).toBeCalledWith('https://example.com/userinfo', {
      headers: {
        Authorization: 'Bearer token',
      },
    });
  });

  it('should return false', async() => {
    Object.defineProperty(env, 'AUTH0_DOMAIN', { value: 'example.com' });
    expect(await verifyCode.inject({
      fetch: () => getPromiseLikeItem({ ok: false, json: () => '' }),
    })('token')).toBe(false);
  });
});
