import { DeleteGuestUseCase } from '$/packages/application/usecase/admin/guests/delete';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('DeleteGuestUseCase', () => {
  it('should delete guest', async() => {
    expect(await (new DeleteGuestUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        email: expect.any(String),
        name: expect.any(String),
        nameKana: expect.any(String),
        phone: expect.any(String),
        zipCode: expect.any(String),
        address: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
