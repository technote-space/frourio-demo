import controller from '$/api/reservations/room/controller';
import { getRoom } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getSelectedRoom } from '$/domains/reservations';

describe('reservations/room', () => {
  it('should get room', async() => {
    const getRoomMock        = jest.fn(() => getPromiseLikeItem({
      id: 123,
      name: 'test',
      number: 10,
      price: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      getSelectedRoom: getSelectedRoom.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: { roomId: 123 },
    });
    expect(res.body).toEqual({
      id: 123,
      name: 'test',
      number: 10,
      price: 10000,
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});
