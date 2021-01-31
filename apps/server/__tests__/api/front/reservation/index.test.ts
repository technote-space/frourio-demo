import controller from '$/api/front/reservation/controller';
import { getRoom } from '$/repositories/room';
import { createReservation } from '$/repositories/reservation';
import { updateGuest } from '$/repositories/guest';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { reserve } from '$/domains/front/reservation';

describe('reservation', () => {
  it('should create reservation', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      name: 'room name',
      price: 10000,
    }));
    const createReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
    }));
    const injectedController = controller.inject({
      reserve: reserve.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
      },
    });
    expect(res.body).toEqual({
      id: 123,
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(createReservationMock).toBeCalledWith({
      data: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        number: 2,
        checkin: new Date('2020-01-01'),
        checkout: new Date('2020-01-03'),
        room: {
          connect: {
            id: 1,
          },
        },
        roomName: 'room name',
        amount: 40000,
        status: 'reserved',
      },
    });
  });

  it('should create reservation with update info', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      name: 'room name',
      price: 10000,
    }));
    const createReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
    }));
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
    }));
    const injectedController = controller.inject({
      reserve: reserve.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
        updateInfo: 1,
      },
      user: { id: 321 },
    });
    expect(res.body).toEqual({
      id: 123,
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(createReservationMock).toBeCalledWith({
      data: {
        guest: {
          connect: {
            id: 321,
          },
        },
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        number: 2,
        checkin: new Date('2020-01-01'),
        checkout: new Date('2020-01-03'),
        room: {
          connect: {
            id: 1,
          },
        },
        roomName: 'room name',
        amount: 40000,
        status: 'reserved',
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        name: 'guest name',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '03-0000-0000',
      },
      where: {
        id: 321,
      },
    });
  });
});
