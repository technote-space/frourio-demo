import controller from '$/api/dashboard/checkin/controller';
import { getReservation, getReservationCount, getReservations, updateReservation } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { checkin, getCheckin } from '$/domains/dashboard';
import { startOfTomorrow, addDays } from 'date-fns';

describe('dashboard/checkin', () => {
  it('should get today\'s checkin reservations', async() => {
    const getReservationsMock     = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
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
        status: 'reserved',
      },
      {
        id: 234,
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
        status: 'cancelled',
      },
    ]));
    const getReservationCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController      = controller.inject({
      getCheckin: getCheckin.inject({
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
              count: getReservationCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        query: {
          filters: [],
          page: 0,
          pageSize: 2,
          totalCount: 100,
          search: 'test name',
          orderBy: {},
          orderDirection: 'desc',
        },
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
              guestName: {
                contains: 'name',
              },
            },
            {
              guestNameKana: {
                contains: 'name',
              },
            },
            {
              guestPhone: {
                contains: 'name',
              },
            },
            {
              roomName: {
                contains: 'name',
              },
            },
          ],
        },
      ],
    };
    expect(getReservationsMock).toBeCalledWith({
      orderBy: undefined,
      select: {
        checkin: true,
        checkout: true,
        guestName: true,
        guestNameKana: true,
        guestPhone: true,
        id: true,
        roomName: true,
        status: true,
      },
      skip: 0,
      take: 2,
      where,
    });
    expect(getReservationCountMock).toBeCalledWith({
      where,
    });
  });

  it('should get another day\'s checkin reservations', async() => {
    const getReservationsMock     = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
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
        status: 'reserved',
      },
      {
        id: 234,
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
        status: 'cancelled',
      },
    ]));
    const getReservationCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController      = controller.inject({
      getCheckin: getCheckin.inject({
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
              count: getReservationCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        date: startOfTomorrow(),
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
          checkin: {
            gte: startOfTomorrow(),
            lt: addDays(startOfTomorrow(), 1),
          },
        },
      ],
    };
    expect(getReservationsMock).toBeCalledWith({
      orderBy: undefined,
      select: {
        checkin: true,
        checkout: true,
        guestName: true,
        guestNameKana: true,
        guestPhone: true,
        id: true,
        roomName: true,
        status: true,
      },
      skip: 0,
      take: 10,
      where,
    });
    expect(getReservationCountMock).toBeCalledWith({
      where,
    });
  });

  it('should checkin', async() => {
    const getReservationMock    = jest.fn(() => getPromiseLikeItem({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'reserved',
      payment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'checkin',
      payment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController    = controller.inject({
      checkin: checkin.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: { id: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      status: 'checkin',
    }));
    expect(getReservationMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        status: 'checkin',
      },
      where: {
        id: 123,
      },
    });
  });

  it('should not checkin', async() => {
    const getReservationMock    = jest.fn(() => getPromiseLikeItem({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'checkin',
      payment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const updateReservationMock = jest.fn();
    const injectedController    = controller.inject({
      checkin: checkin.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: { id: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      message: 'Not found or invalid status.',
    }));
    expect(getReservationMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
    expect(updateReservationMock).not.toBeCalled();
  });
});
