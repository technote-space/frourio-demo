import controller from '$/api/stripe/payment/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { createPaymentIntents } from '$/domains/front/reservation/stripe';
import { getReservation } from '$/repositories/reservation';

describe('reservation/stripe/payment', () => {
  it('should create payment intents', async() => {
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      guest: {
        stripe: 'stripe',
      },
    }));
    const injectedController = controller.inject({
      createPaymentIntents: createPaymentIntents.inject({
        stripe: {
          paymentIntents: {
            create: paymentIntentsCreateMock,
          },
        },
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ body: { reservationId: 123, paymentMethodsId: 'pm_test' } });
    expect(res.body).toEqual({ id: 'test' });
    expect(paymentIntentsCreateMock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      customer: 'stripe',
      'payment_method': 'pm_test',
      'capture_method': 'manual',
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      include: {
        guest: {
          select: {
            stripe: true,
          },
        },
      },
      where: {
        id: 123,
      },
    });
  });

  it('should create payment intents (no related guest)', async() => {
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
    }));
    const injectedController = controller.inject({
      createPaymentIntents: createPaymentIntents.inject({
        stripe: {
          paymentIntents: {
            create: paymentIntentsCreateMock,
          },
        },
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ body: { reservationId: 123, paymentMethodsId: 'pm_test' } });
    expect(res.body).toEqual({ id: 'test' });
    expect(paymentIntentsCreateMock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      'payment_method': 'pm_test',
      'capture_method': 'manual',
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      include: {
        guest: {
          select: {
            stripe: true,
          },
        },
      },
      where: {
        id: 123,
      },
    });
  });
});
