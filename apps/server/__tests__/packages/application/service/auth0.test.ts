import { getPromiseLikeItem } from '$/__tests__/utils';
import { verifyCode } from '$/packages/application/service/auth0';

jest.mock('@frourio-demo/config', () => ({
  auth0: {
    domain: 'example.com',
  },
}));

describe('verifyCode', () => {
  it('should return auth info', async() => {
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
    expect(await verifyCode.inject({
      fetch: () => getPromiseLikeItem({ ok: false, json: () => '' }),
    })('token')).toBe(false);
  });
});
