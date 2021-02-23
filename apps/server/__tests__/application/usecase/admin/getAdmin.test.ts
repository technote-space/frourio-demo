import { GetAdminUseCase } from '$/application/usecase/admin/getAdmin';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/infra/http/response';

describe('GetAdminUseCase', () => {
  it('should return admin response', async() => {
    expect(await (new GetAdminUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute({
      id: 1,
      roles: [],
    })).toEqual({
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

  it('should throw error', async() => {
    await expect((new GetAdminUseCase(new TestAdminRepository(), new ResponseRepository())).execute({
      id: 1,
      roles: [],
    })).rejects.toThrow();
  });
});
