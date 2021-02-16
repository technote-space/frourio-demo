import controller from '$/api/admin/dashboard/sales/daily/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getDailySales } from '$/domains/admin/dashboard';
import { parse, startOfMonth, endOfMonth, startOfToday } from 'date-fns';

describe('dashboard/sales/daily', () => {
  it('should get daily sales', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      {
        checkin: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        payment: 1,
      },
      {
        checkin: parse('2020-03-02', 'yyyy-MM-dd', new Date()),
        payment: 1,
      },
      {
        checkin: parse('2020-03-02', 'yyyy-MM-dd', new Date()),
        payment: 2,
      },
      {
        checkin: parse('2020-03-03', 'yyyy-MM-dd', new Date()),
      },
    ]));
    const injectedController  = controller.inject({
      getDailySales: getDailySales.inject({
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
        date: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        roomId: 123,
      },
    });
    expect(res.body).toEqual(expect.arrayContaining([
      {
        day: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        sales: 1,
      },
      {
        day: parse('2020-03-02', 'yyyy-MM-dd', new Date()),
        sales: 3,
      },
      {
        day: parse('2020-03-03', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        day: parse('2020-03-04', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        day: parse('2020-03-31', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
    ]));
    expect(res.body).not.toEqual(expect.arrayContaining([
      {
        day: parse('2020-02-29', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        day: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
    ]));
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        payment: true,
      },
      where: {
        checkin: {
          gte: startOfMonth(parse('2020-03-01', 'yyyy-MM-dd', new Date())),
          lt: endOfMonth(parse('2020-03-01', 'yyyy-MM-dd', new Date())),
        },
        roomId: 123,
        payment: {
          not: null
        },
      },
    });
  });

  it('should get today\'s daily sales', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([ ]));
    const injectedController  = controller.inject({
      getDailySales: getDailySales.inject({
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
      query: {},
    });
    expect(res.body).toEqual(expect.arrayContaining([
      {
        day: startOfToday(),
        sales: 0,
      },
    ]));
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkin: true,
        payment: true,
      },
      where: {
        checkin: {
          gte: startOfMonth(startOfToday()),
          lt: endOfMonth(startOfToday()),
        },
        roomId: undefined,
        payment: {
          not: null
        },
      },
    });
  });
});
