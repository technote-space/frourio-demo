import { ListRoomsUseCase } from '$/packages/application/usecase/front/rooms/list';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('ListRoomsUseCase', () => {
  it('should list rooms', async() => {
    expect(await (new ListRoomsUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute()).toEqual({
      status: 200,
      body: [{
        id: 1,
        name: expect.any(String),
        number: expect.any(Number),
        price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }],
    });
  });
});
