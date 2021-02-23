import { ListGuestsUseCase } from '$/application/usecase/admin/guests/list';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('ListGuestUseCase', () => {
  it('should list guests', async() => {
    expect(await (new ListGuestsUseCase(new TestGuestRepository([getDummyGuestData()]), new ResponseRepository())).execute(getQuery({
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
