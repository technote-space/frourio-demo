import controller from '$/api/admin/reservations/calendar/checkin/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getCheckinNotSelectable } from '$/domains/admin/reservations';
import { parse } from 'date-fns';

describe('reservations/calendar/checkin', () => {
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
        checkin: parse('2020-03-01 15:00', 'yyyy-MM-dd HH:mm', new Date()),
        checkout: parse('2020-03-03 10:00', 'yyyy-MM-dd HH:mm', new Date()),
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
        checkin: parse('2020-03-03 15:00', 'yyyy-MM-dd HH:mm', new Date()),
        checkout: parse('2020-03-04 10:00', 'yyyy-MM-dd HH:mm', new Date()),
        status: 'checkin',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 345,
        guestId: 456,
        guestName: 'test name3',
        guestNameKana: 'テスト3',
        guestZipCode: '100-0003',
        guestAddress: 'テスト県テスト市3',
        guestPhone: '090-3234-5678',
        roomId: 111,
        roomName: 'test room3',
        number: 30,
        amount: 30000,
        checkin: parse('2020-03-05 15:00', 'yyyy-MM-dd HH:mm', new Date()),
        checkout: parse('2020-03-06 10:00', 'yyyy-MM-dd HH:mm', new Date()),
        status: 'checkin',
        payment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const injectedController  = controller.inject({
      getCheckinNotSelectable: getCheckinNotSelectable.inject({
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
        start: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        end: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
      },
    });
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toEqual({
      start: '2020-03-01',
      end: '2020-03-04',
      allDay: true,
      color: '#a99',
      textColor: 'black',
      display: 'background',
    });
    expect(res.body[1]).toEqual({
      start: '2020-03-05',
      end: '2020-03-06',
      allDay: true,
      color: '#a99',
      textColor: 'black',
      display: 'background',
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
          gt: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
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
      getCheckinNotSelectable: getCheckinNotSelectable.inject({
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
        start: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        end: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        id: 123,
      },
    });
    expect(res.body).toHaveLength(0);
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
          gt: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
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
