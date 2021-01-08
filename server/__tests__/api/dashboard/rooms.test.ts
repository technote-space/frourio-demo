import controller from '$/api/dashboard/rooms/controller';
import { getRooms } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getSelectableRooms } from '$/domains/dashboard';

describe('dashboard/rooms', () => {
  it('should get rooms', async() => {
    const getRoomsMock       = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        name: 'test1',
        number: 1,
        price: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        name: 'test2',
        number: 2,
        price: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const injectedController = controller.inject({
      getSelectableRooms: getSelectableRooms.inject({
        getRooms: getRooms.inject({
          prisma: {
            room: {
              findMany: getRoomsMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
    });
    expect(res.body).toEqual([
      {
        id: 123,
        name: 'test1',
      },
      {
        id: 234,
        name: 'test2',
      },
    ]);
    expect(getRoomsMock).toBeCalledTimes(1);
  });
});
