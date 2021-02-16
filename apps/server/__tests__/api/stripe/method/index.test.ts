import controller from '$/api/stripe/method/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getDefaultPaymentMethod } from '$/domains/stripe';
import { getGuest } from '$/repositories/guest';
import { getStripeDefaultPaymentMethod } from '$/repositories/stripe';

describe('reservation/stripe/method', () => {
  it('should return payment method (object)', async() => {
    const customerRetrieveMock = jest.fn(() => getPromiseLikeItem({
      deleted: false,
      'invoice_settings': {
        'default_payment_method': {
          id: 'pm_test',
        },
      },
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getDefaultPaymentMethod: getDefaultPaymentMethod.inject({
        getStripeDefaultPaymentMethod: getStripeDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              retrieve: customerRetrieveMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual({ id: 'pm_test' });
    expect(customerRetrieveMock).toBeCalledWith('stripe');
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return payment method (string)', async() => {
    const customerRetrieveMock = jest.fn(() => getPromiseLikeItem({
      deleted: false,
      'invoice_settings': {
        'default_payment_method': 'pm_test',
      },
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getDefaultPaymentMethod: getDefaultPaymentMethod.inject({
        getStripeDefaultPaymentMethod: getStripeDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              retrieve: customerRetrieveMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual({ id: 'pm_test' });
    expect(customerRetrieveMock).toBeCalledWith('stripe');
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return empty (stripe customer is not set)', async() => {
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: null }));
    const injectedController = controller.inject({
      getDefaultPaymentMethod: getDefaultPaymentMethod.inject({
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual({ id: undefined });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return empty (deleted customer)', async() => {
    const customerRetrieveMock = jest.fn(() => getPromiseLikeItem({
      deleted: true,
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getDefaultPaymentMethod: getDefaultPaymentMethod.inject({
        getStripeDefaultPaymentMethod: getStripeDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              retrieve: customerRetrieveMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual({ id: undefined });
    expect(customerRetrieveMock).toBeCalledWith('stripe');
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return empty (default payment method is not set)', async() => {
    const customerRetrieveMock = jest.fn(() => getPromiseLikeItem({
      deleted: false,
      'invoice_settings': {
        'default_payment_method': null,
      },
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getDefaultPaymentMethod: getDefaultPaymentMethod.inject({
        getStripeDefaultPaymentMethod: getStripeDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              retrieve: customerRetrieveMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual({ id: undefined });
    expect(customerRetrieveMock).toBeCalledWith('stripe');
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});
