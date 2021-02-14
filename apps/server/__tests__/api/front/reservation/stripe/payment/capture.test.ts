import controller from '$/api/front/reservation/stripe/payment/capture/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { capturePaymentIntents } from '$/domains/front/reservation/stripe';
import { getReservation, updateReservation } from '$/repositories/reservation';

describe('reservation/stripe/payment/capture', () => {
  it('should capture payment intents', async() => {
    const paymentIntentsCaptureMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      amount_received: 10000,
    }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      amount: 10000,
      paymentIntents: 'pi_test',
    }));
    const updateReservationMock = jest.fn();
    const injectedController = controller.inject({
      capturePaymentIntents: capturePaymentIntents.inject({
        stripe: {
          paymentIntents: {
            capture: paymentIntentsCaptureMock,
          },
        },
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ body: { reservationId: 123, isCancel: '' } });
    expect(res.body).toEqual({
      amount: 10000,
      amount_received: 10000,
    });
    expect(paymentIntentsCaptureMock).toBeCalledWith('pi_test', {});
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        payment: 10000,
      },
      where: {
        id: 123,
      },
    });
  });

  it('should capture payment intents (cancel)', async() => {
    const paymentIntentsCaptureMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      amount_received: 8000,
    }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      amount: 10000,
      paymentIntents: 'pi_test',
    }));
    const updateReservationMock = jest.fn();
    const injectedController = controller.inject({
      capturePaymentIntents: capturePaymentIntents.inject({
        stripe: {
          paymentIntents: {
            capture: paymentIntentsCaptureMock,
          },
        },
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ body: { reservationId: 123, isCancel: '1' } });
    expect(res.body).toEqual({
      amount: 10000,
      amount_received: 8000,
    });
    expect(paymentIntentsCaptureMock).toBeCalledWith('pi_test', { amount_to_capture: 8000 });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        payment: 8000,
      },
      where: {
        id: 123,
      },
    });
  });

  it('should not capture payment intents (no payment intents)', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      amount: 10000,
    }));
    const injectedController = controller.inject({
      capturePaymentIntents: capturePaymentIntents.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ body: { reservationId: 123, isCancel: '' } });
    expect(res.status).toBe(400);
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});
