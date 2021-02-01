import controller from '$/api/admin/rooms/calendar/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getStatusCalendarEvents } from '$/domains/admin/rooms';
import { startOfMonth, endOfMonth, startOfToday } from 'date-fns';

describe('rooms/calendar', () => {
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
    const injectedController  = controller.inject({
      getStatusCalendarEvents: getStatusCalendarEvents.inject({
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
        roomId: 123,
        start: startOfMonth(startOfToday()),
        end: endOfMonth(startOfToday()),
      },
    });
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toEqual(expect.objectContaining({
      title: 'test name1 (10人)',
    }));
    expect(res.body[1]).toEqual(expect.objectContaining({
      title: 'test name2 (20人)',
    }));
    expect(getReservationsMock).toBeCalledWith({
      select: {
        guestName: true,
        number: true,
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: endOfMonth(startOfToday()),
        },
        checkout: {
          gt: startOfMonth(startOfToday()),
        },
        roomId: 123,
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
