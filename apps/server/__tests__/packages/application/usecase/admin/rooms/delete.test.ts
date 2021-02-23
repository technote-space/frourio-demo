import { DeleteRoomUseCase } from '$/packages/application/usecase/admin/rooms/delete';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('DeleteRoomUseCase', () => {
  it('should delete room', async() => {
    expect(await (new DeleteRoomUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        name: expect.any(String),
        number: expect.any(Number),
        price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
