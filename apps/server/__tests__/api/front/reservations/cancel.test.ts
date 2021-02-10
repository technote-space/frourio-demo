import controller from '$/api/front/reservations/_code@string/cancel/controller';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { cancel } from '$/domains/front/reservations';
import * as mail from '$/service/mail';

jest.mock('$/service/mail');

describe('account/reservations/detail/cancel', () => {
  it('should cancel reservation', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
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
      params: { code: '6F4ZGO6ZE625' },
    });
    expect(res.body).toEqual({
      id: 123,
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        code: '6F4ZGO6ZE625',
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
    expect(spyOn).toBeCalledWith(undefined, '予約キャンセル', 'Cancelled', {
      'reservation.id': 123,
    });
  });
});
