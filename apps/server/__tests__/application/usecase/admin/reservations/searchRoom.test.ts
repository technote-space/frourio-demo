import { SearchRoomUseCase } from '$/application/usecase/admin/reservations/searchRoom';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('SearchRoomUseCase', () => {
  it('should search room', async() => {
    expect(await (new SearchRoomUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(getQuery({
      orderBy: 'name',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
            id: 1,
            name: expect.any(String),
            number: expect.any(Number),
            price: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });
});
