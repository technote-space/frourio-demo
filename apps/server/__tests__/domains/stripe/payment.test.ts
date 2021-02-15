import { getPromiseLikeItem } from '$/__tests__/utils';
import { createPaymentIntents, capturePaymentIntents, checkoutReservations } from '$/domains/stripe';
import { getReservations, updateReservation } from '$/repositories/reservation';

describe('createPaymentIntents', () => {
  it('should create payment intents', async() => {
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const injected = createPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          create: paymentIntentsCreateMock,
        },
      },
    });

    expect(await injected(10000, {
      id: 123,
      stripe: 'stripe',
    }, 'pm_test')).toEqual({ id: 'test' });
    expect(paymentIntentsCreateMock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      customer: 'stripe',
      'payment_method': 'pm_test',
      'capture_method': 'manual',
    });
  });

  it('should create payment intents (no related guest)', async() => {
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const injected = createPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          create: paymentIntentsCreateMock,
        },
      },
    });

    expect(await injected(10000, { id: 123 }, 'pm_test')).toEqual({ id: 'test' });
    expect(paymentIntentsCreateMock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      'payment_method': 'pm_test',
      'capture_method': 'manual',
    });
  });
});

describe('capturePaymentIntents', () => {
  it('should capture payment intents', async() => {
    const paymentIntentsCaptureMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      'amount_received': 10000,
    }));
    const updateReservationMock = jest.fn();
    const injected = capturePaymentIntents.inject({
      stripe: {
        paymentIntents: {
          capture: paymentIntentsCaptureMock,
        },
      },
      updateReservation: updateReservation.inject({
        prisma: {
          reservation: {
            update: updateReservationMock,
          },
        },
      }),
    });

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: 'pi_test',
    })).toEqual({
      amount: 10000,
      'amount_received': 10000,
    });
    expect(paymentIntentsCaptureMock).toBeCalledWith('pi_test', {});
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
      'amount_received': 8000,
    }));
    const updateReservationMock = jest.fn();
    const injected = capturePaymentIntents.inject({
      stripe: {
        paymentIntents: {
          capture: paymentIntentsCaptureMock,
        },
      },
      updateReservation: updateReservation.inject({
        prisma: {
          reservation: {
            update: updateReservationMock,
          },
        },
      }),
    });

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: 'pi_test',
    }, true)).toEqual({
      amount: 10000,
      'amount_received': 8000,
    });
    expect(paymentIntentsCaptureMock).toBeCalledWith('pi_test', { 'amount_to_capture': 8000 });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        payment: 8000,
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
  });

  it('should not capture payment intents (no payment intents)', async() => {
    const injected = capturePaymentIntents.inject({});

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: null,
    })).toBe(null);
  });
});

describe('checkoutReservations', () => {
  it('should capture payment intents', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 123,
      status: 'reserved',
      payment: null,
      paymentIntents: 'pi_test',
      amount: 10000,
    }]));
    const paymentIntentsCaptureMock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      'amount_received': 8000,
    }));
    const updateReservationMock = jest.fn();
    const sleepMock = jest.fn();
    const injected = checkoutReservations.inject({
      capturePaymentIntents: capturePaymentIntents.inject({
        stripe: {
          paymentIntents: {
            capture: paymentIntentsCaptureMock,
          },
        },
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
      }),
      getReservations: getReservations.inject({
        prisma: {
          reservation: {
            findMany: getReservationsMock,
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
      sleep: sleepMock,
    });

    await injected();
    expect(getReservationsMock).toBeCalledWith({
      where: {
        status: {
          in: ['reserved', 'checkin'],
        },
        checkout: {
          lte: expect.any(Date),
        },
      },
    });
    expect(paymentIntentsCaptureMock).toBeCalledWith('pi_test', {
      'amount_to_capture': 8000,
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        payment: 8000,
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
    expect(sleepMock).toBeCalledTimes(1);
  });

  it('should update status', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 123,
      status: 'checkin',
      payment: null,
      paymentIntents: 'pi_test',
      amount: 10000,
    }]));
    const updateReservationMock = jest.fn();
    const sleepMock = jest.fn();
    const injected = checkoutReservations.inject({
      getReservations: getReservations.inject({
        prisma: {
          reservation: {
            findMany: getReservationsMock,
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
      sleep: sleepMock,
    });

    await injected();
    expect(getReservationsMock).toBeCalledWith({
      where: {
        status: {
          in: ['reserved', 'checkin'],
        },
        checkout: {
          lte: expect.any(Date),
        },
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        status: 'checkout',
      },
      where: {
        id: 123,
      },
    });
    expect(sleepMock).not.toBeCalled();
  });
});
