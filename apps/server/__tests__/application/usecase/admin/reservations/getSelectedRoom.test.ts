import { GetSelectedRoomUseCase } from '$/application/usecase/admin/reservations/getSelectedRoom';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';

describe('GetSelectedRoomUseCase', () => {
  it('should get selected room', async() => {
    expect(await (new GetSelectedRoomUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        name: expect.any(String),
        number: expect.any(Number),
        price: expect.any(Number),
      },
    });
  });
});
