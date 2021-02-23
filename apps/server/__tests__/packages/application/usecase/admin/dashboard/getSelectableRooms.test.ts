import { GetSelectableRoomsUseCase } from '$/packages/application/usecase/admin/dashboard/getSelectableRooms';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('GetSelectableRoomsUseCase', () => {
  it('should get selectable rooms', async() => {
    expect(await (new GetSelectableRoomsUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute()).toEqual({
      status: 200,
      body: [{
        id: 1,
        name: expect.any(String),
      }],
    });
  });
});
