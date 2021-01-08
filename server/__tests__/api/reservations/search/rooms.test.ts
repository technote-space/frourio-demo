import controller from '$/api/reservations/search/rooms/controller';
import { getRooms, getRoomCount } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { searchRoom } from '$/domains/reservations';

describe('reservations/search/rooms', () => {
  it('should search rooms', async() => {
    const getRoomsMock      = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        name: 'test12',
        number: 1,
        price: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        name: 'test22',
        number: 2,
        price: 20000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const getRoomsCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      searchRoom: searchRoom.inject({
        getRooms: getRooms.inject({
          prisma: {
            room: {
              findMany: getRoomsMock,
            },
          },
        }),
        getRoomCount: getRoomCount.inject({
          prisma: {
            room: {
              count: getRoomsCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        filters: [],
        page: 10,
        pageSize: 2,
        totalCount: 100,
        search: '  ',
        orderBy: {
          field: 'name',
        },
        orderDirection: 'asc',
      },
    });
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toEqual(expect.objectContaining({
      id: 123,
    }));
    expect(res.body.data[1]).toEqual(expect.objectContaining({
      id: 234,
    }));
    expect(getRoomsMock).toBeCalledWith({
      orderBy: {
        name: 'asc',
      },
      skip: 2,
      take: 2,
      where: undefined,
    });
    expect(getRoomsCountMock).toBeCalledWith({
      where: undefined,
    });
  });
});
