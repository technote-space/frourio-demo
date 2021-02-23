import type { IPaymentRepository, PaymentCustomer, PaymentMethod, PaymentIntent } from '$/domain/payment';

type Options = {
  defaultPaymentMethod?: string | null
  paymentMethods?: PaymentMethod[]
  captured?: PaymentIntent | null
}

export class TestPaymentRepository implements IPaymentRepository {
  public constructor(private options?: Options) {
  }

  attachPaymentMethod(): Promise<string> {
    return Promise.resolve('cus_test');
  }

  cancelPaymentIntents(): Promise<boolean> {
    return Promise.resolve(true);
  }

  capturePaymentIntents(): Promise<PaymentIntent | null> {
    return Promise.resolve(this.options?.captured ?? null);
  }

  createPaymentIntents(amount: number): Promise<PaymentIntent> {
    return Promise.resolve({
      id: 'pi_test',
      amount,
      amountReceived: amount,
    });
  }

  detachPaymentMethod(): Promise<PaymentMethod> {
    return Promise.resolve({
      id: 'pm_test',
      card: {
        brand: 'visa',
        expMonth: 2,
        expYear: 22,
        last4: '2222',
      },
    });
  }

  getDefaultPaymentMethod(): Promise<string | undefined> {
    return Promise.resolve(this.options && 'defaultPaymentMethod' in this.options ? this.options?.defaultPaymentMethod ?? undefined : 'pm_test');
  }

  listPaymentMethods(): Promise<PaymentMethod[]> {
    return Promise.resolve(this.options?.paymentMethods ?? []);
  }

  setDefaultPaymentMethod(): Promise<PaymentCustomer | undefined> {
    return Promise.resolve(undefined);
  }
}
