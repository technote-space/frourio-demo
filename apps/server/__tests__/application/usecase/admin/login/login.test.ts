import { LoginUseCase } from '$/application/usecase/admin/login/login';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/infra/http/response';
import { getFastify } from '$/__tests__/utils';

describe('CreateAdminUseCase', () => {
  it('should login', async() => {
    expect(await (new LoginUseCase(new TestAdminRepository([
      getDummyAdminData({ email: 'test@example.com' }),
    ]), new ResponseRepository())).execute.inject({
      createAdminAuthorizationPayload: () => ({ id: 1, roles: [] }),
    })({
      email: 'test@example.com',
      pass: 'pass',
    }, getFastify())).toEqual({
      status: 204,
      headers: {
        authorization: expect.any(String),
      },
    });
  });

  it('should fail to login', async() => {
    expect(await (new LoginUseCase(new TestAdminRepository(), new ResponseRepository())).execute({
      email: 'test@example.com',
      pass: 'pass',
    }, getFastify())).toEqual({
      status: 401,
    });
  });
});
