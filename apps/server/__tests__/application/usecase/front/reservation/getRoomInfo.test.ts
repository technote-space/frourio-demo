import { GetRoomInfoUseCase } from '$/application/usecase/front/reservation/getRoomInfo';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';

describe('GetRoomInfoUseCase', () => {
  it('should get room info', async() => {
    expect(await (new GetRoomInfoUseCase(new TestRoomRepository([getDummyRoomData()]), new ResponseRepository())).execute(1)).toEqual({
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
