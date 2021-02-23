import { ListRoomsUseCase } from '$/packages/application/usecase/admin/rooms/list';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('ListRoomUseCase', () => {
  it('should list rooms', async() => {
    expect(await (new ListRoomsUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(getQuery({
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
