import type { Reservation } from '$/domain/database/reservation';
import type { Guest } from '$/domain/database/guest';
import type { IPaymentRepository, PaymentCustomer, PaymentMethod, PaymentIntent } from '$/domain/payment';

type Options = {
  defaultPaymentMethod?: string | null
  paymentMethods?: PaymentMethod[]
  captured?: PaymentIntent | null
}

export class TestPaymentRepository implements IPaymentRepository {
  public constructor(private options?: Options) {
  }

  attachPaymentMethod(guest: Guest, methodId: string): Promise<string> {
    return Promise.resolve('cus_test');
  }

  cancelPaymentIntents(reservation: { id: number; paymentIntents: string | null }): Promise<boolean> {
    return Promise.resolve(true);
  }

  capturePaymentIntents(reservation: Pick<Reservation, 'id' | 'amount' | 'payment' | 'paymentIntents'>, isCancel?: boolean): Promise<PaymentIntent | null> {
    return Promise.resolve(this.options?.captured ?? null);
  }

  createPaymentIntents(amount: number, guest: { id?: number; paymentId?: string | null }, paymentMethodsId: string): Promise<PaymentIntent> {
    return Promise.resolve({
      id: 'pi_test',
      amount,
      amountReceived: amount,
    });
  }

  detachPaymentMethod(id: string): Promise<PaymentMethod> {
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

  getDefaultPaymentMethod(guest: Guest): Promise<string | undefined> {
    return Promise.resolve(this.options && 'defaultPaymentMethod' in this.options ? this.options?.defaultPaymentMethod ?? undefined : 'pm_test');
  }

  listPaymentMethods(guest: Guest): Promise<PaymentMethod[]> {
    return Promise.resolve(this.options?.paymentMethods ?? []);
  }

  setDefaultPaymentMethod(guest: Guest, methodId: string): Promise<PaymentCustomer | undefined> {
    return Promise.resolve(undefined);
  }
}
