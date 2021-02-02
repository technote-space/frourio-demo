import controller from '$/api/front/account/reservations/cancelled/controller';
import { getReservations } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getCancelledReservations } from '$/domains/front/account';

describe('account/reservations/cancelled', () => {
  it('should get reservations', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { id: 1 },
      { id: 2 },
    ]));
    const injectedController = controller.inject({
      getCancelledReservations: getCancelledReservations.inject({
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
        status: 'cancelled',
      },
      take: 20,
    });
  });
});
