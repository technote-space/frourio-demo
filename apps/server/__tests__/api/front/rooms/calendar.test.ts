import controller from '$/api/front/rooms/_roomId@number/calendar/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { calendar } from '$/domains/front/rooms';
import { getReservations } from '$/repositories/reservation';

describe('rooms/calendar', () => {
  it('should get not selectable events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { checkin: new Date('2020-01-01'), checkout: new Date('2020-01-03') },
      { checkin: new Date('2020-01-03'), checkout: new Date('2020-01-06') },
      { checkin: new Date('2020-01-07'), checkout: new Date('2020-01-08') },
    ]));
    const injectedController = controller.inject({
      calendar: calendar.inject({
        getReservations: getReservations.inject({
          prisma: { reservation: { findMany: getReservationsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      params: { roomId: 1 },
      query: {
        start: new Date('2020-01-01'),
        end: new Date('2020-01-31'),
      },
    });
    expect(res.body).toEqual([
      {
        'allDay': true,
        'color': '#a99',
        'display': 'background',
        'start': '2020-01-01',
        'end': '2020-01-06',
        'textColor': 'black',
      },
      {
        'allDay': true,
        'color': '#a99',
        'display': 'background',
        'start': '2020-01-07',
        'end': '2020-01-08',
        'textColor': 'black',
      },
    ]);
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: new Date('2020-01-31'),
        },
        checkout: {
          gt: new Date('2020-01-01'),
        },
        roomId: 1,
        status: {
          not: 'cancelled',
        },
      },
    });
  });

  it('should return empty', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([]));
    const injectedController = controller.inject({
      calendar: calendar.inject({
        getReservations: getReservations.inject({
          prisma: { reservation: { findMany: getReservationsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      params: { roomId: 1 },
      query: {
        start: new Date('2020-01-01'),
        end: new Date('2020-01-31'),
      },
    });
    expect(res.body).toEqual([]);
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: new Date('2020-01-31'),
        },
        checkout: {
          gt: new Date('2020-01-01'),
        },
        roomId: 1,
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
