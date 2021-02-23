import { GetSelectedGuestUseCase } from '$/packages/application/usecase/admin/reservations/getSelectedGuest';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('GetSelectedGuestUseCase', () => {
  it('should get selected guest', async() => {
    expect(await (new GetSelectedGuestUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        email: expect.any(String),
        name: expect.any(String),
      },
    });
  });
});
