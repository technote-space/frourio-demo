import { LoginUseCase } from '$/application/usecase/front/login/login';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';

describe('LoginUseCase', () => {
  it('should login', async() => {
    expect(await (new LoginUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute.inject(deps => ({
      createGuestAuthorizationPayload: () => ({ id: 1 }),
      verifyCode: deps.verifyCode.inject({
        fetch: () => getPromiseLikeItem({
          ok: true,
          json: () => getPromiseLikeItem({ email: 'test@example.com', sub: 'test' }),
        }),
      }),
    }))({
      accessToken: 'token',
    }, getFastify())).toEqual({
      status: 204,
      headers: {
        authorization: expect.any(String),
      },
    });
  });

  it('should login', async() => {
    expect(await (new LoginUseCase(new TestGuestRepository([getDummyGuestData(), getDummyGuestData()]), new ResponseRepository())).execute.inject(deps => ({
      createGuestAuthorizationPayload: () => ({ id: 1 }),
      verifyCode: deps.verifyCode.inject({
        fetch: () => getPromiseLikeItem({
          ok: true,
          json: () => getPromiseLikeItem({ email: 'test@example.com', sub: 'test' }),
        }),
      }),
    }))({
      accessToken: 'token',
    }, getFastify())).toEqual({
      status: 204,
      headers: {
        authorization: expect.any(String),
      },
    });
  });

  it('should login', async() => {
    expect(await (new LoginUseCase(new TestGuestRepository([]), new ResponseRepository())).execute.inject(deps => ({
      createGuestAuthorizationPayload: () => ({ id: 1 }),
      verifyCode: deps.verifyCode.inject({
        fetch: () => getPromiseLikeItem({
          ok: true,
          json: () => getPromiseLikeItem({ email: 'test@example.com', sub: 'test' }),
        }),
      }),
    }))({
      accessToken: 'token',
    }, getFastify())).toEqual({
      status: 204,
      headers: {
        authorization: expect.any(String),
      },
    });
  });

  it('should fail to login', async() => {
    expect(await (new LoginUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute.inject(deps => ({
      createGuestAuthorizationPayload: () => ({ id: 1 }),
      verifyCode: deps.verifyCode.inject({
        fetch: () => getPromiseLikeItem({
          ok: false,
        }),
      }),
    }))({
      accessToken: 'token',
    }, getFastify())).toEqual({
      status: 401,
    });
  })
});
