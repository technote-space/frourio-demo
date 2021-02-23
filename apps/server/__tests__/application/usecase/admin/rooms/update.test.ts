import { UpdateRoomUseCase } from '$/application/usecase/admin/rooms/update';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';

describe('UpdateRoomUseCase', () => {
  it('should update room', async() => {
    expect(await (new UpdateRoomUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(1, {
      name: 'new name',
    })).toEqual({
      status: 200,
      body: {
        id: 1,
        name: 'new name',
        number: expect.any(Number),
        price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
