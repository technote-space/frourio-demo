import type { Guest } from '$/packages/domain/database/guest';
import type { Reservation } from '$/packages/domain/database/reservation';

export type PaymentCustomer = {
  id: string;
  email?: string;
  name?: string;
  defaultPaymentMethod?: string;
}
export type PaymentMethod = {
  id: string;
  card: {
    brand: string;
    expMonth: number;
    expYear: number;
    last4: string;
    fingerprint?: string;
  }
}
export type PaymentIntent = {
  id: string;
  amount: number;
  amountReceived: number;
  canceledAt?: number;
}

export interface IPaymentRepository {
  getDefaultPaymentMethod(guest: Guest): Promise<string | undefined>;

  setDefaultPaymentMethod(guest: Guest, methodId: string): Promise<PaymentCustomer | undefined>;

  listPaymentMethods(guest: Guest): Promise<PaymentMethod[]>;

  attachPaymentMethod(guest: Guest, methodId: string): Promise<string>;

  detachPaymentMethod(id: string): Promise<PaymentMethod>;

  createPaymentIntents(amount: number, guest: { id?: number; paymentId?: string | null }, paymentMethodsId: string): Promise<PaymentIntent>;

  cancelPaymentIntents(reservation: { id: number, paymentIntents: string | null }): Promise<boolean>;

  capturePaymentIntents(reservation: Pick<Reservation, 'id' | 'amount' | 'payment' | 'paymentIntents'>, isCancel?: boolean): Promise<PaymentIntent | null>;

  handleWebhook(body: any, sig: string): Promise<{ received: boolean }>;
}
