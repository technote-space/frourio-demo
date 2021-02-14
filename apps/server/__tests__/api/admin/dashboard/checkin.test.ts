import { startOfTomorrow, addDays, set, format } from 'date-fns';
import controller from '$/api/admin/dashboard/checkin/controller';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getReservation, getReservationCount, getReservations, updateReservation } from '$/repositories/reservation';
import { createRoomKey } from '$/repositories/roomKey';
import { checkin, getCheckin, sendRoomKey } from '$/domains/admin/dashboard';
import { isValidCheckinDateRange } from '$/service/reservation';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('dashboard/checkin', () => {
  it('should get today\'s checkin reservations', async() => {
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
        status: 'reserved',
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
        status: 'cancelled',
      },
    ]));
    const getReservationCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
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
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isAfter: () => true,
          isBefore: () => true,
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
        status: 'reserved',
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
        status: 'cancelled',
      },
    ]));
    const getReservationCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
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
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isAfter: () => false,
          isBefore: () => true,
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
          pageSize: 10,
          totalCount: 2,
          search: '',
          orderBy: {},
          orderDirection: 'desc',
        },
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
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      code: '6F4ZGO6ZE625',
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
      code: '6F4ZGO6ZE625',
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
    const injectedController = controller.inject({
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
      code: '6F4ZGO6ZE625',
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
      rejectOnNotFound: true,
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
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      code: '6F4ZGO6ZE625',
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
    const injectedController = controller.inject({
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
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateReservationMock).not.toBeCalled();
  });

  it('should send room key', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const checkin = set(new Date(), { hours: 15, minutes: 0, seconds: 0, milliseconds: 0 });
    const checkout = set(addDays(new Date(), 1), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      guestEmail: 'test@example.com',
      roomId: 321,
      room: { key: '1111' },
      checkin,
      checkout,
    }));
    const createRoomKeyMock = jest.fn(() => getPromiseLikeItem({ key: 'new key' }));
    const encryptQrInfoMock = jest.fn(() => 'test');
    const toDataURLMock = jest.fn(() => getPromiseLikeItem('url'));

    const injectedController = controller.inject({
      sendRoomKey: sendRoomKey.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        createRoomKey: createRoomKey.inject({
          prisma: {
            roomKey: {
              create: createRoomKeyMock,
            },
          },
        }),
        encryptQrInfo: encryptQrInfoMock,
        toDataURL: toDataURLMock,
      }),
    })(getFastify());

    const res = await injectedController.post({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: { id: 123 },
    });
    expect(res.body).toEqual({
      guestEmail: 'test@example.com',
      id: 123,
      roomId: 321,
      room: { key: '1111' },
      checkin,
      checkout,
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(createRoomKeyMock).toBeCalledWith({
      data: {
        key: expect.any(String),
        trials: 0,
        startAt: set(checkin, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
        endAt: set(checkout, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
        reservation: {
          connect: {
            id: 123,
          },
        },
      },
    });
    expect(spyOn).toBeCalledWith('test@example.com', '入室情報のお知らせ', 'RoomKey', {
      'reservation.guestEmail': 'test@example.com',
      'reservation.key': 'new key',
      'reservation.id': 123,
      'reservation.roomId': 321,
      'reservation.qr': 'url',
      'reservation.checkin': format(checkin, 'yyyy/MM/dd HH:mm'),
      'reservation.checkout': format(checkout, 'yyyy/MM/dd HH:mm'),
    });
    expect(encryptQrInfoMock).toBeCalledWith({ reservationId: 123, key: 'new key', roomId: 321 });
    expect(toDataURLMock).toBeCalledWith('test');
  });
});
