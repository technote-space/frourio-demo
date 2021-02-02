import controller from '$/api/front/rooms/controller';
import { getRooms } from '$/repositories/room';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { list } from '$/domains/front/rooms';

describe('rooms', () => {
  it('should get rooms', async() => {
    const getRoomsMock = jest.fn(() => getPromiseLikeItem([
      { id: 1 },
      { id: 2 },
    ]));
    const injectedController = controller.inject({
      list: list.inject({
        getRooms: getRooms.inject({
          prisma: { room: { findMany: getRoomsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({});
    expect(res.body).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(getRoomsMock).toBeCalledWith(undefined);
  });
});
