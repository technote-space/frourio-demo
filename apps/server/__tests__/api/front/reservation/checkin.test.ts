import controller from '$/api/front/reservation/calendar/checkin/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getCheckinNotSelectable } from '$/domains/front/reservation';

describe('reservation/calendar/checkin', () => {
  it('should return not selectable events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { checkin: new Date('2020-01-01'), checkout: new Date('2020-01-03') },
      { checkin: new Date('2020-01-03'), checkout: new Date('2020-01-06') },
      { checkin: new Date('2020-01-07'), checkout: new Date('2020-01-08') },
    ]));
    const injectedController = controller.inject({
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
      headers: undefined,
      query: {
        roomId: 1,
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
        status: {
          not: 'cancelled',
        },
        OR: [
          { roomId: 1 },
        ],
      },
    });
  });

  it('should return not selectable events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([]));
    const injectedController = controller.inject({
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
      headers: undefined,
      query: {
        roomId: 1,
        start: new Date('2020-01-01'),
        end: new Date('2020-01-31'),
      },
      user: { id: 321 },
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
        status: {
          not: 'cancelled',
        },
        OR: [
          { roomId: 1 },
          { guestId: 321 },
        ],
      },
    });
  });
});
