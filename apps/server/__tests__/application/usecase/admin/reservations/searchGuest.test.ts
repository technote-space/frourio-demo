import { SearchGuestUseCase } from '$/application/usecase/admin/reservations/searchGuest';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('SearchGuestUseCase', () => {
  it('should search guest', async() => {
    expect(await (new SearchGuestUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(getQuery({
      orderBy: 'name',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
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
        ],
      },
    });
  });
});
