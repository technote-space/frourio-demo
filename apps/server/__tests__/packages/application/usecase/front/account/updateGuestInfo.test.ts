import { UpdateGuestInfoUseCase } from '$/packages/application/usecase/front/account/updateGuestInfo';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('UpdateGuestInfoUseCase', () => {
  it('should update guest info', async() => {
    expect(await (new UpdateGuestInfoUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(
      { id: 1 },
      { name: 'new name' },
    )).toEqual({
      status: 200,
      body: {
        id: 1,
        email: expect.any(String),
        name: 'new name',
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
