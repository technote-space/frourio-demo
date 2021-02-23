import { getPromiseLikeItem } from '$/__tests__/utils';
import { PaymentRepository } from '$/packages/infra/payment';

const repository = new PaymentRepository();
const card1 = {
  brand: 'visa',
  'exp_month': 2,
  'exp_year': 22,
  last4: '1111',
};
const card2 = {
  brand: 'visa',
  'exp_month': 2,
  'exp_year': 22,
  last4: '1111',
  fingerprint: 'aaaaa',
};

describe('getDefaultPaymentMethod', () => {
  it('should get default payment method 1', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      id: 'cus_test',
      email: 'test@example.com',
      name: 'test',
      'invoice_settings': {
        'default_payment_method': 'pm_test',
      },
    }));
    const injected = repository.getDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          retrieve: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' })).toBe('pm_test');
    expect(mock).toBeCalledWith('cus_test');
  });

  it('should get default payment method 2', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      id: 'cus_test',
      'invoice_settings': {
        'default_payment_method': {
          id: 'pm_test',
        },
      },
    }));
    const injected = repository.getDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          retrieve: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' })).toBe('pm_test');
    expect(mock).toBeCalledWith('cus_test');
  });

  it('should return undefined 1', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      id: 'cus_test',
      'invoice_settings': {
        'default_payment_method': null,
      },
    }));
    const injected = repository.getDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          retrieve: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' })).toBeUndefined();
    expect(mock).toBeCalledWith('cus_test');
  });

  it('should return undefined 2', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      deleted: true,
    }));
    const injected = repository.getDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          retrieve: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' })).toBeUndefined();
    expect(mock).toBeCalledWith('cus_test');
  });

  it('should return undefined 3', async() => {
    const mock = jest.fn();
    const injected = repository.getDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          retrieve: mock,
        },
      },
    });

    expect(await injected({ paymentId: null })).toBeUndefined();
    expect(mock).not.toBeCalled();
  });
});

describe('setDefaultPaymentMethod', () => {
  it('should set default payment method', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      id: 'cus_test',
      email: 'test@example.com',
      name: 'test',
      'invoice_settings': {
        'default_payment_method': 'pm_test',
      },
    }));
    const injected = repository.setDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          update: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' }, 'new_id')).toEqual({
      id: 'cus_test',
      email: 'test@example.com',
      name: 'test',
      defaultPaymentMethod: 'pm_test',
    });
    expect(mock).toBeCalledWith('cus_test', {
      'invoice_settings': {
        'default_payment_method': 'new_id',
      },
    });
  });

  it('should not set default payment method', async() => {
    const mock = jest.fn();
    const injected = repository.setDefaultPaymentMethod.inject({
      stripe: {
        customers: {
          update: mock,
        },
      },
    });

    expect(await injected({ paymentId: null }, 'new_id')).toBeUndefined();
    expect(mock).not.toBeCalled();
  });
});

describe('listPaymentMethods', () => {
  it('should return payment methods', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      data: [
        { id: 'pm_test1', card: card1 },
        { id: 'pm_test2', card: card2 },
      ],
    }));
    const injected = repository.listPaymentMethods.inject({
      stripe: {
        paymentMethods: {
          list: mock,
        },
      },
    });

    expect(await injected({ paymentId: 'cus_test' })).toEqual([
      {
        id: 'pm_test1',
        card: {
          brand: 'visa',
          expMonth: 2,
          expYear: 22,
          last4: '1111',
        },
      },
      {
        id: 'pm_test2',
        card: {
          brand: 'visa',
          expMonth: 2,
          expYear: 22,
          last4: '1111',
          fingerprint: 'aaaaa',
        },
      },
    ]);
    expect(mock).toBeCalledWith({
      customer: 'cus_test',
      type: 'card',
    });
  });

  it('should return empty', async() => {
    const mock = jest.fn();
    const injected = repository.listPaymentMethods.inject({
      stripe: {
        paymentMethods: {
          list: mock,
        },
      },
    });

    expect(await injected({ paymentId: null })).toEqual([]);
  });
});

describe('attachPaymentMethod', () => {
  it('should attach payment method', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'pm_test',
      customer: null,
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn();
    const injected = repository.attachPaymentMethod.inject({
      stripe: {
        paymentMethods: {
          retrieve: paymentMethodsRetrieveMock,
          attach: paymentMethodsAttachMock,
        },
        customers: {
          create: customersCreateMock,
        },
      },
    });

    expect(await injected({
      email: 'test@example.com',
      name: null,
      phone: null,
      paymentId: 'cus_test',
    }, 'pm_test')).toBe('cus_test');
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).toBeCalledWith('pm_test', {
      customer: 'cus_test',
    });
    expect(customersCreateMock).not.toBeCalled();
  });

  it('should create new customer', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'pm_test',
      customer: null,
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'cus_created' }));
    const injected = repository.attachPaymentMethod.inject({
      stripe: {
        paymentMethods: {
          retrieve: paymentMethodsRetrieveMock,
          attach: paymentMethodsAttachMock,
        },
        customers: {
          create: customersCreateMock,
        },
      },
    });

    expect(await injected({
      email: 'test@example.com',
      name: null,
      phone: null,
      paymentId: null,
    }, 'pm_test')).toBe('cus_created');
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).toBeCalledWith('pm_test', {
      customer: 'cus_created',
    });
    expect(customersCreateMock).toBeCalledWith({ email: 'test@example.com' });
  });

  it('should not update payment method', async() => {
    const paymentMethodsRetrieveMock = jest.fn(() => getPromiseLikeItem({
      id: 'pm_test',
      customer: 'cus_created',
    }));
    const paymentMethodsAttachMock = jest.fn();
    const customersCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'cus_created' }));
    const injected = repository.attachPaymentMethod.inject({
      stripe: {
        paymentMethods: {
          retrieve: paymentMethodsRetrieveMock,
          attach: paymentMethodsAttachMock,
        },
        customers: {
          create: customersCreateMock,
        },
      },
    });

    expect(await injected({
      email: 'test@example.com',
      name: 'test',
      phone: '090-0000-0000',
      paymentId: null,
    }, 'pm_test')).toBe('cus_created');
    expect(paymentMethodsRetrieveMock).toBeCalledWith('pm_test');
    expect(paymentMethodsAttachMock).not.toBeCalled();
    expect(customersCreateMock).toBeCalledWith({
      email: 'test@example.com',
      name: 'test',
      phone: '090-0000-0000',
    });
  });
});

describe('detachPaymentMethod', () => {
  it('should detach payment method', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 'pi_test', card: card2 }));
    const injected = repository.detachPaymentMethod.inject({
      stripe: {
        paymentMethods: {
          detach: mock,
        },
      },
    });

    expect(await injected('pi_test')).toEqual({
      id: 'pi_test',
      card: {
        brand: 'visa',
        expMonth: 2,
        expYear: 22,
        last4: '1111',
        fingerprint: 'aaaaa',
      },
    });
    expect(mock).toBeCalledWith('pi_test');
  });
});

describe('createPaymentIntents', () => {
  it('should create payment intents', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const injected = repository.createPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          create: mock,
        },
      },
    });

    expect(await injected(10000, {
      id: 123,
      paymentId: 'cus_test',
    }, 'pm_test')).toEqual({ id: 'test' });
    expect(mock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      customer: 'cus_test',
      'payment_method': 'pm_test',
      'capture_method': 'manual',
      confirm: true,
    });
  });

  it('should create payment intents (no related guest)', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 'test' }));
    const injected = repository.createPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          create: mock,
        },
      },
    });

    expect(await injected(10000, { id: 123 }, 'pm_test')).toEqual({ id: 'test' });
    expect(mock).toBeCalledWith({
      amount: 10000,
      currency: 'jpy',
      'payment_method_types': ['card'],
      'payment_method': 'pm_test',
      'capture_method': 'manual',
      confirm: true,
    });
  });
});

describe('cancelPaymentIntents', () => {
  it('should cancel payment intents', async() => {
    const mock = jest.fn();
    const injected = repository.cancelPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          cancel: mock,
        },
      },
    });

    expect(await injected({ id: 123, paymentIntents: 'pi_test' })).toBe(true);
    expect(mock).toBeCalledWith('pi_test');
  });

  it('should not cancel payment intents', async() => {
    const mock = jest.fn();
    const injected = repository.cancelPaymentIntents.inject({
      stripe: {
        paymentIntents: {
          cancel: mock,
        },
      },
    });

    expect(await injected({ id: 123, paymentIntents: null })).toBe(false);
    expect(mock).not.toBeCalled();
  });
});

describe('capturePaymentIntents', () => {
  it('should capture payment intents', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      id: 'pi_test',
      amount: 10000,
      'amount_received': 10000,
      'canceled_at': 123,
    }));
    const injected = repository.capturePaymentIntents.inject({
      stripe: {
        paymentIntents: {
          capture: mock,
        },
      },
    });

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: 'pi_test',
    })).toEqual({
      id: 'pi_test',
      amount: 10000,
      amountReceived: 10000,
      canceledAt: 123,
    });
    expect(mock).toBeCalledWith('pi_test', {});
  });

  it('should capture payment intents (cancel)', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({
      amount: 10000,
      'amount_received': 8000,
    }));
    const injected = repository.capturePaymentIntents.inject({
      stripe: {
        paymentIntents: {
          capture: mock,
        },
      },
    });

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: 'pi_test',
    }, true)).toEqual({
      amount: 10000,
      amountReceived: 8000,
    });
    expect(mock).toBeCalledWith('pi_test', { 'amount_to_capture': 8000 });
  });

  it('should not capture payment intents (no payment intents)', async() => {
    const injected = repository.capturePaymentIntents.inject({});

    expect(await injected({
      id: 123,
      amount: 10000,
      payment: null,
      paymentIntents: null,
    })).toBeNull();
  });
});
