import controller from '$/api/front/reservation/rooms/_roomId@number/controller';
import { getRoom } from '$/repositories/room';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getRoomInfo } from '$/domains/front/reservation';

describe('reservation/room', () => {
  it('should get room info', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
    }));
    const injectedController = controller.inject({
      getRoomInfo: getRoomInfo.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ params: { roomId: 123 } });
    expect(res.body).toEqual({ id: 123 });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});
