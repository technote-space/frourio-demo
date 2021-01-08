import controller from '$/api/reservations/calendar/checkout/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getCheckoutSelectable } from '$/domains/reservations';
import { parse } from 'date-fns';

describe('reservations/calendar/checkout', () => {
  it('should get calendar events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        guestId: 234,
        guestName: 'test name1',
        guestNameKana: 'テスト1',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市1',
        guestPhone: '090-1234-5678',
        roomId: 111,
        roomName: 'test room1',
        number: 10,
        amount: 10000,
        checkin: parse('2020-03-27 15:00', 'yyyy-MM-dd HH:mm', new Date()),
        checkout: parse('2020-03-28 10:00', 'yyyy-MM-dd HH:mm', new Date()),
        status: 'reserved',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        guestId: 345,
        guestName: 'test name2',
        guestNameKana: 'テスト2',
        guestZipCode: '100-0002',
        guestAddress: 'テスト県テスト市2',
        guestPhone: '090-2234-5678',
        roomId: 111,
        roomName: 'test room2',
        number: 20,
        amount: 20000,
        checkin: parse('2020-03-28 15:00', 'yyyy-MM-dd HH:mm', new Date()),
        checkout: parse('2020-03-29 10:00', 'yyyy-MM-dd HH:mm', new Date()),
        status: 'checkin',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const injectedController  = controller.inject({
      getCheckoutSelectable: getCheckoutSelectable.inject({
        getReservations: getReservations.inject({
          prisma: {
            reservation: {
              findMany: getReservationsMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        roomId: 111,
        checkin: parse('2020-03-25', 'yyyy-MM-dd', new Date()),
        end: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
      },
    });
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toEqual({
      start: '2020-03-26',
      end: '2020-03-28',
      allDay: true,
      color: '#a99',
      textColor: 'black',
      display: 'inverse-background',
    });
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        },
        checkout: {
          gt: parse('2020-03-25', 'yyyy-MM-dd', new Date()),
        },
        id: {},
        roomId: 111,
        status: {
          not: 'cancelled',
        },
      },
    });
  });

  it('should get calendar events with id', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([]));
    const injectedController  = controller.inject({
      getCheckoutSelectable: getCheckoutSelectable.inject({
        getReservations: getReservations.inject({
          prisma: {
            reservation: {
              findMany: getReservationsMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        roomId: 111,
        checkin: parse('2020-03-25', 'yyyy-MM-dd', new Date()),
        end: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        id: 123,
      },
    });
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toEqual({
      start: '2020-03-26',
      end: '2020-04-01',
      allDay: true,
      color: '#a99',
      textColor: 'black',
      display: 'inverse-background',
    });
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        },
        checkout: {
          gt: parse('2020-03-25', 'yyyy-MM-dd', new Date()),
        },
        id: {
          not: 123,
        },
        roomId: 111,
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
