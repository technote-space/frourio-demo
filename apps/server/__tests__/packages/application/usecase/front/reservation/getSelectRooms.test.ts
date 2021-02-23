import { GetSelectRoomsUseCase } from '$/packages/application/usecase/front/reservation/getSelectRooms';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('GetSelectRoomsUseCase', () => {
  it('should get select rooms', async() => {
    expect(await (new GetSelectRoomsUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute()).toEqual({
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
