import { CreateAdminUseCase } from '$/packages/application/usecase/admin/admins/create';
import { TestAdminRepository } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('CreateAdminUseCase', () => {
  it('should create admin', async() => {
    expect(await (new CreateAdminUseCase(new TestAdminRepository(), new ResponseRepository())).execute({
      name: 'test',
      email: 'test@example.com',
      password: 'pass',
    })).toEqual({
      status: 201,
      body: {
        id: 1,
        email: expect.any(String),
        name: expect.any(String),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
