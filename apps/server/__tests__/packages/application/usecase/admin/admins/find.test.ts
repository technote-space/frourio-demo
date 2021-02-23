import { FindAdminUseCase } from '$/packages/application/usecase/admin/admins/find';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('FindAdminUseCase', () => {
  it('should find admin', async() => {
    expect(await (new FindAdminUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute(1)).toEqual({
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
