import { FindGuestUseCase } from '$/packages/application/usecase/front/guest/find';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('FindGuestUseCase', () => {
  it('should get guest info', async() => {
    expect(await (new FindGuestUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute({ id: 1 })).toEqual({
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
