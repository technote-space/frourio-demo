import controller from '$/api/front/account/reservations/_reservationId@number/cancel/controller';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { cancel } from '$/domains/front/account';

describe('account/reservations/detail/cancel', () => {
  it('should cancel reservation', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01'),
      checkout: new Date('2020-01-03'),
    }));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
    }));
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: { reservation: { findFirst: getReservationMock } },
        }),
        updateReservation: updateReservation.inject({
          prisma: { reservation: { update: updateReservationMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1 },
      params: { reservationId: 123 },
    });
    expect(res.body).toEqual({
      id: 123,
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
        guestId: 1,
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
  });
});
