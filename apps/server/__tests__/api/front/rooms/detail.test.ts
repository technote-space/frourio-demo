import controller from '$/api/front/rooms/_roomId@number/controller';
import { getRoom } from '$/repositories/room';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { get } from '$/domains/front/rooms';

describe('rooms/detail', () => {
  it('should get room', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({ id: 1 }));
    const injectedController = controller.inject({
      get: get.inject({
        getRoom: getRoom.inject({
          prisma: { room: { findFirst: getRoomMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ params: { roomId: 1 } });
    expect(res.body).toEqual({ id: 1 });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
  });
});
