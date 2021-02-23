import { UpdateAdminUseCase } from '$/packages/application/usecase/admin/admins/update';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('UpdateAdminUseCase', () => {
  it('should update admin', async() => {
    expect(await (new UpdateAdminUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute(1, {
      name: 'new name',
      email: 'new@example.com',
      password: 'pass',
    })).toEqual({
      status: 200,
      body: {
        id: 1,
        email: 'new@example.com',
        name: 'new name',
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
