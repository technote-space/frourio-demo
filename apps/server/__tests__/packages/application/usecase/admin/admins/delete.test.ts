import { DeleteAdminUseCase } from '$/packages/application/usecase/admin/admins/delete';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('DeleteAdminUseCase', () => {
  it('should delete admin', async() => {
    expect(await (new DeleteAdminUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute(1)).toEqual({
      status: 200,
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
