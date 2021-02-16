import controller from '$/api/front/account/reservations/paid/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getPaidReservations } from '$/domains/front/account';

describe('account/reservations/paid', () => {
  it('should get reservations', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { id: 1 },
      { id: 2 },
    ]));
    const injectedController = controller.inject({
      getPaidReservations: getPaidReservations.inject({
        getReservations: getReservations.inject({
          prisma: { reservation: { findMany: getReservationsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1 },
    });
    expect(res.body).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(getReservationsMock).toBeCalledWith({
      orderBy: {
        id: 'desc',
      },
      where: {
        guestId: 1,
        status: {
          in: ['checkin', 'checkout'],
        },
      },
      take: 20,
    });
  });
});
