import controller from '$/api/admin/rooms/controller';
import { getRoomCount, getRooms, createRoom } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { list, create } from '$/domains/admin/rooms';

describe('rooms', () => {
  it('should get rooms', async() => {
    const getRoomsMock       = jest.fn(() => getPromiseLikeItem([
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
    const getRoomsCountMock  = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      list: list.inject({
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
        page: 0,
        pageSize: 2,
        totalCount: 100,
        search: 'test 2',
        orderBy: {},
        orderDirection: 'desc',
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
    const where = {
      AND: [
        {
          OR: [
            {
              name: {
                contains: 'test',
              },
            },
          ],
        },
        {
          OR: [
            {
              price: 2,
            },
            {
              number: 2,
            },
            {
              name: {
                contains: '2',
              },
            },
          ],
        },
      ],
    };
    expect(getRoomsMock).toBeCalledWith({
      orderBy: undefined,
      skip: 0,
      take: 2,
      where,
    });
    expect(getRoomsCountMock).toBeCalledWith({
      where,
    });
  });

  it('should create room', async() => {
    const createRoomMock     = jest.fn();
    const injectedController = controller.inject({
      create: create.inject({
        createRoom: createRoom.inject({
          prisma: {
            room: {
              create: createRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: {
        name: 'test name',
        number: 3,
        price: 30000,
      },
    });
    expect(res.status).toBe(201);
    expect(createRoomMock).toBeCalledWith({
      data: {
        name: 'test name',
        number: 3,
        price: 30000,
      },
    });
  });
});
