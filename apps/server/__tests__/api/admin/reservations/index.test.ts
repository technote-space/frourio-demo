import controller from '$/api/admin/reservations/controller';
import { getReservationCount, getReservations, createReservation } from '$/repositories/reservation';
import { getGuest } from '$/repositories/guest';
import { getRoom } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { list, create } from '$/domains/admin/reservations';

describe('reservations', () => {
  it('should get reservations', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        code: '6F4ZGO6ZE625',
        guestId: 234,
        guestName: 'test name1',
        guestNameKana: 'テスト1',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市1',
        guestPhone: '090-1234-5678',
        roomId: 345,
        roomName: 'test room1',
        number: 10,
        amount: 10000,
        checkin: new Date(),
        checkout: new Date(),
        status: 'reserved',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        code: '6F4ZGO6ZE625',
        guestId: 345,
        guestName: 'test name2',
        guestNameKana: 'テスト2',
        guestZipCode: '100-0002',
        guestAddress: 'テスト県テスト市2',
        guestPhone: '090-2234-5678',
        roomId: 456,
        roomName: 'test room2',
        number: 20,
        amount: 20000,
        checkin: new Date(),
        checkout: new Date(),
        status: 'checkin',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const getReservationsCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      list: list.inject({
        getReservations: getReservations.inject({
          prisma: {
            reservation: {
              findMany: getReservationsMock,
            },
          },
        }),
        getReservationCount: getReservationCount.inject({
          prisma: {
            reservation: {
              count: getReservationsCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        filters: [{
          column: {
            field: 'status',
          },
          value: ['reserved', 'checkin'],
          operator: '=',
        }],
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
              code: {
                contains: 'test',
              },
            },
            {
              guestName: {
                contains: 'test',
              },
            },
            {
              guestNameKana: {
                contains: 'test',
              },
            },
            {
              guestPhone: {
                contains: 'test',
              },
            },
            {
              roomName: {
                contains: 'test',
              },
            },
          ],
        },
        {
          OR: [
            {
              amount: 2,
            },
            {
              payment: 2,
            },
            {
              code: {
                contains: '2',
              },
            },
            {
              guestName: {
                contains: '2',
              },
            },
            {
              guestNameKana: {
                contains: '2',
              },
            },
            {
              guestPhone: {
                contains: '2',
              },
            },
            {
              roomName: {
                contains: '2',
              },
            },
          ],
        },
        {
          status: {
            in: ['reserved', 'checkin'],
          },
        },
      ],
    };
    expect(getReservationsMock).toBeCalledWith({
      orderBy: undefined,
      skip: 0,
      take: 2,
      where,
      include: {
        room: {
          select: {
            number: true,
            price: true,
          },
        },
      },
    });
    expect(getReservationsCountMock).toBeCalledWith({
      where,
    });
  });

  it('should create reservation', async() => {
    const createReservationMock = jest.fn();
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
      email: 'test@example.com',
      name: 'test',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市',
      phone: '090-1234-5678',
    }));
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      id: 345,
      name: 'test',
      number: 1,
      price: 10000,
    }));
    const injectedController = controller.inject({
      create: create.inject({
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: {
        guestId: 234,
        roomId: 345,
        number: 10,
        checkin: '2020-03-15T06:00:00.000Z',
        checkout: '2020-03-17T01:00:00.000Z',
        status: 'reserved',
      },
    });
    expect(res.status).toBe(201);
    expect(createReservationMock).toBeCalledWith({
      data: {
        code: expect.any(String),
        amount: 200000, // 10000 * 2泊 * 10人
        checkin: new Date('2020-03-15T06:00:00.000Z'),
        checkout: new Date('2020-03-17T01:00:00.000Z'),
        guest: {
          connect: {
            id: 234,
          },
        },
        guestEmail: 'test@example.com',
        guestAddress: 'テスト県テスト市',
        guestName: 'test',
        guestNameKana: 'テスト',
        guestPhone: '090-1234-5678',
        guestZipCode: '100-0001',
        number: 10,
        payment: undefined,
        room: {
          connect: {
            id: 345,
          },
        },
        roomName: 'test',
        status: 'reserved',
      },
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 234,
      },
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 345,
      },
    });
  });
});
