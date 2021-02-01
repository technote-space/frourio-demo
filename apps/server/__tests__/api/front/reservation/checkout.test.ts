import controller from '$/api/front/reservation/calendar/checkout/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getCheckoutSelectable } from '$/domains/front/reservation';

describe('reservation/calendar/checkout', () => {
  it('should return selectable events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { checkin: new Date('2020-01-01'), checkout: new Date('2020-01-03') },
      { checkin: new Date('2020-01-03'), checkout: new Date('2020-01-06') },
      { checkin: new Date('2020-01-08'), checkout: new Date('2020-01-09') },
    ]));
    const injectedController = controller.inject({
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
      query: {
        roomId: 1,
        checkin: new Date('2020-01-06'),
        end: new Date('2020-01-31'),
      },
    });
    expect(res.body).toEqual([
      {
        'allDay': true,
        'color': '#a99',
        'display': 'inverse-background',
        'start': '2020-01-07',
        'end': '2020-01-09',
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
          gt: new Date('2020-01-06'),
        },
        roomId: 1,
        status: {
          not: 'cancelled',
        },
      },
    });
  });

  it('should return selectable events', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([]));
    const injectedController = controller.inject({
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
      query: {
        roomId: 1,
        checkin: new Date('2020-01-06'),
        end: new Date('2020-01-31'),
      },
    });
    expect(res.body).toEqual([
      {
        'allDay': true,
        'color': '#a99',
        'display': 'inverse-background',
        'start': '2020-01-07',
        'end': '2020-01-31',
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
          gt: new Date('2020-01-06'),
        },
        roomId: 1,
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
