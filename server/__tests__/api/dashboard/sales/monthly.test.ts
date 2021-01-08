import controller from '$/api/dashboard/sales/monthly/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getMonthlySales } from '$/domains/dashboard';
import { parse, startOfYear, endOfYear, startOfToday, startOfMonth } from 'date-fns';

describe('dashboard/sales/monthly', () => {
  it('should get monthly sales', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      {
        checkout: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        payment: 1,
      },
      {
        checkout: parse('2020-03-02', 'yyyy-MM-dd', new Date()),
        payment: 1,
      },
      {
        checkout: parse('2020-03-02', 'yyyy-MM-dd', new Date()),
        payment: 2,
      },
      {
        checkout: parse('2020-03-03', 'yyyy-MM-dd', new Date()),
      },
      {
        checkout: parse('2020-04-30', 'yyyy-MM-dd', new Date()),
        payment: 1,
      },
    ]));
    const injectedController  = controller.inject({
      getMonthlySales: getMonthlySales.inject({
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
        month: parse('2020-01-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        month: parse('2020-02-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        month: parse('2020-03-01', 'yyyy-MM-dd', new Date()),
        sales: 4,
      },
      {
        month: parse('2020-04-01', 'yyyy-MM-dd', new Date()),
        sales: 1,
      },
      {
        month: parse('2020-05-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        month: parse('2020-12-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
    ]));
    expect(res.body).not.toEqual(expect.arrayContaining([
      {
        month: parse('2019-12-31', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
      {
        month: parse('2021-01-01', 'yyyy-MM-dd', new Date()),
        sales: 0,
      },
    ]));
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkout: true,
        payment: true,
      },
      where: {
        checkout: {
          gte: startOfYear(parse('2020-03-01', 'yyyy-MM-dd', new Date())),
          lt: endOfYear(parse('2020-03-01', 'yyyy-MM-dd', new Date())),
        },
        roomId: 123,
        status: 'checkout',
      },
    });
  });

  it('should get today\'s monthly sales', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([ ]));
    const injectedController  = controller.inject({
      getMonthlySales: getMonthlySales.inject({
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
        month: startOfMonth(startOfToday()),
        sales: 0,
      },
    ]));
    expect(getReservationsMock).toBeCalledWith({
      select: {
        checkout: true,
        payment: true,
      },
      where: {
        checkout: {
          gte: startOfYear(startOfToday()),
          lt: endOfYear(startOfToday()),
        },
        roomId: undefined,
        status: 'checkout',
      },
    });
  });
});
