import controller from '$/api/lock/rooms/_roomId@number/controller';
import { startOfDay, endOfDay } from 'date-fns';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { get, checkout } from '$/domains/lock/rooms';
import { getRoom } from '$/repositories/room';
import { getReservations, updateReservation } from '$/repositories/reservation';
import { getValidReservation, isValidCheckinDateRange } from '$/service/reservation';

describe('rooms/detail', () => {
  it('should get room', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({ id: 1 }));
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([]));
    const injectedController = controller.inject({
      get: get.inject({
        getRoom: getRoom.inject({
          prisma: { room: { findFirst: getRoomMock } },
        }),
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ params: { roomId: 1 } });
    expect(res.body).toEqual({ id: 1 });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        roomId: 1,
        status: {
          in: ['checkin'],
        },
      },
    });
  });

  it('should get room with valid reservation', async() => {
    const getRoomMock = jest.fn(() => getPromiseLikeItem({ id: 1 }));
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{ id: 2 }]));
    const injectedController = controller.inject({
      get: get.inject({
        getRoom: getRoom.inject({
          prisma: { room: { findFirst: getRoomMock } },
        }),
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isBefore: () => true,
            isAfter: () => true,
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ params: { roomId: 1 } });
    expect(res.body).toEqual({ id: 1, reservation: { id: 2 } });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        roomId: 1,
        status: {
          in: ['checkin'],
        },
      },
    });
  });
});

describe('rooms/checkout', () => {
  it('should checkout', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({ id: 1, status: 'checkout' }));
    const injectedController = controller.inject({
      checkout: checkout.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => true,
          }),
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

    const res = await injectedController.delete({ params: { roomId: 2 } });
    expect(res.body).toEqual({ id: 1, status: 'checkout' });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        roomId: 2,
        status: {
          in: ['reserved', 'checkin'],
        },
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        status: 'checkout',
      },
      where: {
        id: 1,
      },
    });
  });

  it('should not checkout', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const injectedController = controller.inject({
      checkout: checkout.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => false,
            isBefore: () => true,
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({ params: { roomId: 2 } });
    expect(res.status).toBe(400);
    expect(getReservationsMock).toBeCalledWith({
      where: {
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        roomId: 2,
        status: {
          in: ['reserved', 'checkin'],
        },
      },
    });
  });
});
