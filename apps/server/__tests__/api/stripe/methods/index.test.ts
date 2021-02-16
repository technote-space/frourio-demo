import controller from '$/api/stripe/methods/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getPaymentMethods, attachPaymentMethod, detachPaymentMethod } from '$/domains/stripe';
import { getGuest, updateGuest } from '$/repositories/guest';
import {
  listStripeDefaultPaymentMethods,
  setDefaultPaymentMethod,
  attachPaymentMethodToCustomer,
  detachPaymentMethodFromCustomer,
} from '$/repositories/stripe';

describe('reservation/stripe/methods', () => {
  it('should return payment methods', async() => {
    const paymentMethodsListMock = jest.fn(() => getPromiseLikeItem({
      data: [
        { id: '1' },
        { id: '2' },
      ],
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getPaymentMethods: getPaymentMethods.inject({
        listStripeDefaultPaymentMethods: listStripeDefaultPaymentMethods.inject({
          stripe: {
            paymentMethods: {
              list: paymentMethodsListMock,
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
    expect(res.body).toEqual([{ id: '1' }, { id: '2' }]);
    expect(paymentMethodsListMock).toBeCalledWith({
      customer: 'stripe',
      type: 'card',
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return empty array (stripe customer is not set)', async() => {
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: null }));
    const injectedController = controller.inject({
      getPaymentMethods: getPaymentMethods.inject({
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
    expect(res.body).toEqual([]);
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});

describe('reservation/stripe/methods/attach', () => {
  it('should attach payment method (create new stripe customer)', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'stripe-id',
      customer: 'stripe-customer',
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'created' }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      email: 'test@example.com',
      name: 'test name',
      phone: 'test phone',
      stripe: null,
    }));
    const updateGuestMock = jest.fn();
    const customersUpdateMock = jest.fn();
    const injectedController = controller.inject({
      attachPaymentMethod: attachPaymentMethod.inject({
        attachPaymentMethodToCustomer: attachPaymentMethodToCustomer.inject({
          stripe: {
            paymentMethods: {
              retrieve: paymentMethodsRetrieveMock,
              attach: paymentMethodsAttachMock,
            },
            customers: {
              create: customersCreateMock,
            },
          },
        }),
        setDefaultPaymentMethod: setDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              update: customersUpdateMock,
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
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.put({
      headers: { authorization: '' },
      user: { id: 123 },
      body: { methodId: 'pm_test' },
    });
    expect(res.status).toBe(200);
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).toBeCalledWith('stripe-id', { customer: 'created' });
    expect(customersCreateMock).toBeCalledWith({
      email: 'test@example.com',
      name: 'test name',
      phone: 'test phone',
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        stripe: 'created',
      },
      where: {
        id: 123,
      },
    });
    expect(customersUpdateMock).not.toBeCalled();
  });

  it('should attach payment method (not create new stripe customer)', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'stripe-id',
      customer: 'stripe-customer',
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'created' }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      email: 'test@example.com',
      name: 'test name',
      phone: 'test phone',
      stripe: 'stripe',
    }));
    const updateGuestMock = jest.fn();
    const customersUpdateMock = jest.fn();
    const injectedController = controller.inject({
      attachPaymentMethod: attachPaymentMethod.inject({
        attachPaymentMethodToCustomer: attachPaymentMethodToCustomer.inject({
          stripe: {
            paymentMethods: {
              retrieve: paymentMethodsRetrieveMock,
              attach: paymentMethodsAttachMock,
            },
            customers: {
              create: customersCreateMock,
            },
          },
        }),
        setDefaultPaymentMethod: setDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              update: customersUpdateMock,
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
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.put({
      headers: { authorization: '' },
      user: { id: 123 },
      body: { methodId: 'pm_test' },
    });
    expect(res.status).toBe(200);
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).toBeCalledWith('stripe-id', { customer: 'stripe' });
    expect(customersCreateMock).not.toBeCalled();
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateGuestMock).not.toBeCalled();
    expect(customersUpdateMock).toBeCalledWith('stripe', {
      'invoice_settings': {
        'default_payment_method': 'pm_test',
      },
    });
  });

  it('should not attach payment method (same customer)', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'stripe-id',
      customer: 'stripe-customer',
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'stripe-customer' }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      email: 'test@example.com',
      stripe: null,
    }));
    const updateGuestMock = jest.fn();
    const customersUpdateMock = jest.fn();
    const injectedController = controller.inject({
      attachPaymentMethod: attachPaymentMethod.inject({
        attachPaymentMethodToCustomer: attachPaymentMethodToCustomer.inject({
          stripe: {
            paymentMethods: {
              retrieve: paymentMethodsRetrieveMock,
              attach: paymentMethodsAttachMock,
            },
            customers: {
              create: customersCreateMock,
            },
          },
        }),
        setDefaultPaymentMethod: setDefaultPaymentMethod.inject({
          stripe: {
            customers: {
              update: customersUpdateMock,
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
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.put({
      headers: { authorization: '' },
      user: { id: 123 },
      body: { methodId: 'pm_test' },
    });
    expect(res.status).toBe(200);
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).not.toBeCalled();
    expect(customersCreateMock).toBeCalledWith({
      email: 'test@example.com',
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        stripe: 'stripe-customer',
      },
      where: {
        id: 123,
      },
    });
    expect(customersUpdateMock).not.toBeCalled();
  });
});

describe('reservation/stripe/methods/detach', () => {
  it('should detach payment method', async() => {
    const paymentMethodsAttachMock = jest.fn();
    const injectedController = controller.inject({
      detachPaymentMethod: detachPaymentMethod.inject({
        detachPaymentMethodFromCustomer: detachPaymentMethodFromCustomer.inject({
          stripe: {
            paymentMethods: {
              detach: paymentMethodsAttachMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({
      headers: { authorization: '' },
      user: { id: 123 },
      body: { methodId: 'pm_test' },
    });
    expect(res.status).toBe(200);
    expect(paymentMethodsAttachMock).toBeCalledWith('pm_test');
  });
});
