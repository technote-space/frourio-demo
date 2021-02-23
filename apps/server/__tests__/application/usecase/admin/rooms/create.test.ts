import { CreateRoomUseCase } from '$/application/usecase/admin/rooms/create';
import { TestRoomRepository } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';

describe('CreateRoomUseCase', () => {
  it('should create room', async() => {
    expect(await (new CreateRoomUseCase(new TestRoomRepository(), new ResponseRepository())).execute({
      name: 'test',
      number: 2,
      price: 3000,
    })).toEqual({
      status: 201,
      body: {
        id: 1,
        name: 'test',
        number: 2,
        price: 3000,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
