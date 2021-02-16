import type { Reservation } from '$/repositories/reservation';
import type { Guest } from '$/repositories/guest';
import { depend } from 'velona';
import Stripe from 'stripe';
import { STRIPE_SECRET } from '$/utils/env';
import { CANCEL_PAYMENT_RATE } from '@frourio-demo/constants';

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 5,
});

export const getStripeDefaultPaymentMethod = depend(
  { stripe: stripe as { customers: { retrieve: typeof stripe.customers.retrieve } } },
  async({ stripe }, guest: Guest): Promise<string | undefined> => {
    if (!guest.stripe) {
      return undefined;
    }

    const customer = await stripe.customers.retrieve(guest.stripe);
    if (customer.deleted || !customer.invoice_settings.default_payment_method) {
      return undefined;
    }

    return typeof customer.invoice_settings.default_payment_method === 'string' ? customer.invoice_settings.default_payment_method : customer.invoice_settings.default_payment_method.id;
  },
);

export const listStripeDefaultPaymentMethods = depend(
  { stripe: stripe as { paymentMethods: { list: typeof stripe.paymentMethods.list } } },
  async({ stripe }, guest: Guest): Promise<Stripe.PaymentMethod[]> => guest.stripe ? (await stripe.paymentMethods.list({
    customer: guest.stripe,
    type: 'card',
  })).data : [],
);

export const attachPaymentMethodToCustomer = depend(
  {
    stripe: stripe as {
      paymentMethods: {
        retrieve: typeof stripe.paymentMethods.retrieve
        attach: typeof stripe.paymentMethods.attach
      }
      customers: { create: typeof stripe.customers.create }
    },
  },
  async({ stripe }, methodId: string, guest: Guest): Promise<string> => {
    const method = await stripe.paymentMethods.retrieve(methodId);
    const getStripeCustomer = async() => {
      if (!guest.stripe) {
        return (await stripe.customers.create({
          email: guest.email,
          ...(guest.name ? { name: guest.name } : {}),
          ...(guest.phone ? { phone: guest.phone } : {}),
        })).id;
      }

      return guest.stripe;
    };

    const customer = await getStripeCustomer();
    if (customer !== method.customer) {
      await stripe.paymentMethods.attach(method.id, {
        customer,
      });
    }

    return customer;
  },
);

export const detachPaymentMethodFromCustomer = depend(
  { stripe: stripe as { paymentMethods: { detach: typeof stripe.paymentMethods.detach } } },
  async({ stripe }, id: string) => stripe.paymentMethods.detach(id),
);

export const createStripePaymentIntents = depend(
  { stripe: stripe as { paymentIntents: { create: typeof stripe.paymentIntents.create } } },
  async({ stripe }, amount: number, guest: { id?: number; stripe?: string | null }, paymentMethodsId: string): Promise<Stripe.PaymentIntent> => {
    return stripe.paymentIntents.create({
      amount,
      currency: 'jpy',
      'payment_method_types': ['card'],
      customer: guest.stripe ?? undefined,
      'payment_method': paymentMethodsId,
      'capture_method': 'manual',
      confirm: true,
    });
  },
);

export const cancelStripePaymentIntents = depend(
  { stripe: stripe as { paymentIntents: { cancel: typeof stripe.paymentIntents.cancel } } },
  async({ stripe }, reservation: { id: number, paymentIntents: string | null }): Promise<boolean> => {
    if (reservation.paymentIntents) {
      await stripe.paymentIntents.cancel(reservation.paymentIntents);
      return true;
    }

    return false;
  },
);

export const captureStripePaymentIntents = depend(
  { stripe: stripe as { paymentIntents: { capture: typeof stripe.paymentIntents.capture } } },
  async({ stripe }, reservation: Pick<Reservation, 'id' | 'amount' | 'payment' | 'paymentIntents'>, isCancel?: boolean): Promise<Stripe.PaymentIntent | null> => {
    if (reservation.payment || !reservation.paymentIntents) {
      return null;
    }

    return stripe.paymentIntents.capture(reservation.paymentIntents, {
      ...(isCancel ? {
        'amount_to_capture': Math.ceil(reservation.amount * CANCEL_PAYMENT_RATE),
      } : {}),
    });
  },
);
