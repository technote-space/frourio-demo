import controller from '$/api/front/reservation/rooms/controller';
import { getRooms } from '$/repositories/room';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getSelectRooms } from '$/domains/front/reservation';

describe('reservation/rooms', () => {
  it('should create reservation', async() => {
    const getRoomsMock = jest.fn(() => getPromiseLikeItem([
      { id: 1 },
      { id: 2 },
    ]));
    const injectedController = controller.inject({
      getSelectRooms: getSelectRooms.inject({
        getRooms: getRooms.inject({
          prisma: {
            room: {
              findMany: getRoomsMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({});
    expect(res.body).toEqual([{ id: 1 }, { id: 2 }]);
    expect(getRoomsMock).toBeCalledWith(undefined);
  });
});
