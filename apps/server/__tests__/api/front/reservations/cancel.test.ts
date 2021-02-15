import controller from '$/api/front/reservations/_code@string/cancel/controller';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { cancel } from '$/domains/front/reservations';
import { cancelPaymentIntents } from '$/domains/stripe';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('account/reservations/detail/cancel', () => {
  it('should cancel reservation', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01'),
      checkout: new Date('2020-01-03'),
      paymentIntents: 'pi_test',
    }));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      status: 'cancelled',
    }));
    const paymentIntentsCancelMock = jest.fn();
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: { reservation: { findFirst: getReservationMock } },
        }),
        cancelPaymentIntents: cancelPaymentIntents.inject({
          stripe: {
            paymentIntents: {
              cancel: paymentIntentsCancelMock,
            },
          },
          updateReservation: updateReservation.inject({
            prisma: { reservation: { update: updateReservationMock } },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      params: { code: '6F4ZGO6ZE625' },
    });
    expect(res.body).toEqual({
      id: 123,
      status: 'cancelled',
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: false,
      where: {
        code: '6F4ZGO6ZE625',
        status: {
          not: 'cancelled',
        },
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
    expect(paymentIntentsCancelMock).toBeCalledWith('pi_test');
    expect(spyOn).toBeCalledWith(undefined, '予約キャンセル', 'Cancelled', {
      'reservation.id': 123,
      'reservation.status': 'cancelled',
    });
  });

  it('should cancel reservation (with no paymentIntents)', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01'),
      checkout: new Date('2020-01-03'),
    }));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      status: 'cancelled',
    }));
    const paymentIntentsCancelMock = jest.fn();
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: { reservation: { findFirst: getReservationMock } },
        }),
        cancelPaymentIntents: cancelPaymentIntents.inject({
          stripe: {
            paymentIntents: {
              cancel: paymentIntentsCancelMock,
            },
          },
          updateReservation: updateReservation.inject({
            prisma: { reservation: { update: updateReservationMock } },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      params: { code: '6F4ZGO6ZE625' },
    });
    expect(res.body).toEqual({
      id: 123,
      status: 'cancelled',
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: false,
      where: {
        code: '6F4ZGO6ZE625',
        status: {
          not: 'cancelled',
        },
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
    expect(paymentIntentsCancelMock).not.toBeCalled();
    expect(spyOn).toBeCalledWith(undefined, '予約キャンセル', 'Cancelled', {
      'reservation.id': 123,
      'reservation.status': 'cancelled',
    });
  });

  it('should not cancel reservation', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem(null));
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: { reservation: { findFirst: getReservationMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      params: { code: '6F4ZGO6ZE625' },
    });
    expect(res.status).toBe(400);
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: false,
      where: {
        code: '6F4ZGO6ZE625',
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
