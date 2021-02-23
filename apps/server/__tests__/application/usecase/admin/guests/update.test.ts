import { UpdateGuestUseCase } from '$/application/usecase/admin/guests/update';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';

describe('UpdateGuestUseCase', () => {
  it('should update guest', async() => {
    expect(await (new UpdateGuestUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(1, {
      email: 'new@example.com',
    })).toEqual({
      status: 200,
      body: {
        id: 1,
        email: 'new@example.com',
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
