import controller from '$/api/reservations/_reservationId@number/controller';
import { getReservation, updateReservation, deleteReservation } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get, update, remove } from '$/domains/reservations';
import { getGuest } from '$/repositories/guest';
import { getRoom } from '$/repositories/room';

describe('reservations/detail', () => {
  it('should get reservation', async() => {
    const getReservationMock       = jest.fn(() => getPromiseLikeItem({
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
    const injectedController = controller.inject({
      get: get.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { reservationId: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      guestId: 234,
      roomId: 345,
      status: 'reserved',
    }));
    expect(getReservationMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });

  it('should update reservation', async() => {
    const updateReservationMock    = jest.fn();
    const getGuestMock          = jest.fn(() => getPromiseLikeItem({
      id: 234,
      name: 'test',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市',
      phone: '090-1234-5678',
    }));
    const getRoomMock           = jest.fn(() => getPromiseLikeItem({
      id: 345,
      name: 'test',
      number: 1,
      price: 10000,
    }));
    const injectedController = controller.inject({
      update: update.inject({
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
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

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { reservationId: 123 },
      body: {
        guestId: 234,
        roomId: 345,
        number: 10,
        checkin: '2020-03-15T06:00:00.000Z',
        checkout: '2020-03-17T01:00:00.000Z',
        status: 'cancelled',
        payment: 10000,
      },
    });
    expect(res.status).toBe(200);
    expect(updateReservationMock).toBeCalledWith({
      data: {
        amount: 200000, // 10000 * 2泊 * 10人
        checkin: new Date('2020-03-15T06:00:00.000Z'),
        checkout: new Date('2020-03-17T01:00:00.000Z'),
        guest: {
          connect: {
            id: 234,
          },
        },
        guestAddress: 'テスト県テスト市',
        guestName: 'test',
        guestNameKana: 'テスト',
        guestPhone: '090-1234-5678',
        guestZipCode: '100-0001',
        number: 10,
        payment: 10000,
        room: {
          connect: {
            id: 345,
          },
        },
        roomName: 'test',
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
    expect(getGuestMock).toBeCalledWith({
      where: {
        id: 234,
      },
    });
    expect(getRoomMock).toBeCalledWith({
      where: {
        id: 345,
      },
    });
  });

  it('should update reservation with empty status', async() => {
    const updateReservationMock    = jest.fn();
    const getGuestMock          = jest.fn(() => getPromiseLikeItem({
      id: 234,
      name: 'test',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市',
      phone: '090-1234-5678',
    }));
    const getRoomMock           = jest.fn(() => getPromiseLikeItem({
      id: 345,
      name: 'test',
      number: 1,
      price: 10000,
    }));
    const injectedController = controller.inject({
      update: update.inject({
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
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

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { reservationId: 123 },
      body: {
        guestId: 234,
        roomId: 345,
        number: 10,
        checkin: '2020-03-15T06:00:00.000Z',
        checkout: '2020-03-17T01:00:00.000Z',
        payment: 10000,
      },
    });
    expect(res.status).toBe(200);
    expect(updateReservationMock).toBeCalledWith({
      data: {
        amount: 200000, // 10000 * 2泊 * 10人
        checkin: new Date('2020-03-15T06:00:00.000Z'),
        checkout: new Date('2020-03-17T01:00:00.000Z'),
        guest: {
          connect: {
            id: 234,
          },
        },
        guestAddress: 'テスト県テスト市',
        guestName: 'test',
        guestNameKana: 'テスト',
        guestPhone: '090-1234-5678',
        guestZipCode: '100-0001',
        number: 10,
        payment: 10000,
        room: {
          connect: {
            id: 345,
          },
        },
        roomName: 'test',
        status: 'reserved',
      },
      where: {
        id: 123,
      },
    });
    expect(getGuestMock).toBeCalledWith({
      where: {
        id: 234,
      },
    });
    expect(getRoomMock).toBeCalledWith({
      where: {
        id: 345,
      },
    });
  });

  it('should delete reservation', async() => {
    const deleteReservationMock    = jest.fn();
    const injectedController = controller.inject({
      remove: remove.inject({
        deleteReservation: deleteReservation.inject({
          prisma: {
            reservation: {
              delete: deleteReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { reservationId: 123 },
    });
    expect(res.status).toBe(200);
    expect(deleteReservationMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });
});
