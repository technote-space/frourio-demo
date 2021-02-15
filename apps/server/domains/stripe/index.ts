import type { BasicResponse, BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import Stripe from 'stripe';
import { getGuest, updateGuest } from '$/repositories/guest';
import { getReservations, updateReservation } from '$/repositories/reservation';
import { logger } from '$/service/logging';
import { sleep } from '@frourio-demo/utils/misc';
import { STRIPE_SECRET } from '$/utils/env';
import { CANCEL_PAYMENT_RATE } from '@frourio-demo/constants';

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 5,
});

export const getDefaultPaymentMethod = depend(
  {
    stripe: stripe as { customers: { retrieve: typeof stripe.customers.retrieve } },
    getGuest,
  },
  async({ stripe, getGuest }, guestId: number): Promise<BodyResponse<string | undefined>> => {
    const guest = await getGuest(guestId);
    if (!guest.stripe) {
      return {
        status: 200,
        body: undefined,
      };
    }

    const customer = await stripe.customers.retrieve(guest.stripe);
    if (customer.deleted) {
      return {
        status: 200,
        body: undefined,
      };
    }

    if (!customer.invoice_settings.default_payment_method) {
      return {
        status: 200,
        body: undefined,
      };
    }

    return {
      status: 200,
      body: typeof customer.invoice_settings.default_payment_method === 'string' ? customer.invoice_settings.default_payment_method : customer.invoice_settings.default_payment_method.id,
    };
  },
);

export const getPaymentMethods = depend(
  {
    stripe: stripe as { paymentMethods: { list: typeof stripe.paymentMethods.list } },
    getGuest,
  },
  async({ stripe, getGuest }, guestId: number): Promise<BodyResponse<Stripe.PaymentMethod[]>> => {
    const guest = await getGuest(guestId);
    return {
      status: 200,
      body: guest.stripe ? (await stripe.paymentMethods.list({
        customer: guest.stripe,
        type: 'card',
      })).data : [],
    };
  },
);

export const attachPaymentMethod = depend(
  {
    stripe: stripe as {
      paymentMethods: {
        retrieve: typeof stripe.paymentMethods.retrieve
        attach: typeof stripe.paymentMethods.attach
      }
      customers: { create: typeof stripe.customers.create }
    },
    getGuest,
    updateGuest,
  },
  async({ stripe, getGuest, updateGuest }, methodId: string, guestId: number): Promise<BasicResponse> => {
    logger.info('attachPaymentMethod, id=%s, guest=%d', methodId, guestId);
    const method = await stripe.paymentMethods.retrieve(methodId);
    const guest = await getGuest(guestId);
    const getStripeCustomer = async() => {
      if (!guest.stripe) {
        const customer = await stripe.customers.create({
          email: guest.email,
          ...(guest.name ? { name: guest.name } : {}),
          ...(guest.phone ? { phone: guest.phone } : {}),
        });
        await updateGuest(guest.id, { stripe: customer.id });
        return customer.id;
      }

      return guest.stripe;
    };

    const customer = await getStripeCustomer();
    logger.info('attachPaymentMethod, customer=%s, method.customer=%s', customer, method.customer);
    if (customer !== method.customer) {
      await stripe.paymentMethods.attach(method.id, {
        customer,
      });
    }

    return {
      status: 200,
    };
  },
);

export const detachPaymentMethod = depend(
  { stripe: stripe as { paymentMethods: { detach: typeof stripe.paymentMethods.detach } } },
  async({ stripe }, id: string): Promise<BasicResponse> => {
    logger.info('detachPaymentMethod, id=%s', id);
    await stripe.paymentMethods.detach(id);
    return {
      status: 200,
    };
  },
);

export const createPaymentIntents = depend(
  { stripe: stripe as { paymentIntents: { create: typeof stripe.paymentIntents.create } } },
  async({ stripe }, amount: number, guest: { id?: number; stripe?: string | null }, paymentMethodsId: string): Promise<Stripe.PaymentIntent> => {
    logger.info('createPaymentIntents, id=%s, guest=%d, amount=%d', paymentMethodsId, guest.id, amount);
    return stripe.paymentIntents.create({
      amount,
      currency: 'jpy',
      'payment_method_types': ['card'],
      customer: guest.stripe ?? undefined,
      'payment_method': paymentMethodsId,
      'capture_method': 'manual',
    });
  },
);

export const capturePaymentIntents = depend(
  {
    stripe: stripe as { paymentIntents: { capture: typeof stripe.paymentIntents.capture } },
    updateReservation,
  },
  async({
    stripe,
    updateReservation,
  }, reservation: Pick<Reservation, 'id' | 'amount' | 'payment' | 'paymentIntents'>, isCancel?: boolean): Promise<Stripe.PaymentIntent | null> => {
    logger.info('capturePaymentIntents, reservation=%d, payment=%d, id=%s, isCancel=%d', reservation.id, reservation.payment, reservation.paymentIntents, isCancel);
    if (reservation.payment || !reservation.paymentIntents) {
      return null;
    }

    const result = await stripe.paymentIntents.capture(reservation.paymentIntents, {
      ...(isCancel ? {
        'amount_to_capture': Math.ceil(reservation.amount * CANCEL_PAYMENT_RATE),
      } : {}),
    });
    logger.info('capturePaymentIntents, amount=%d, amount_received=%d', result.amount, result.amount_received);
    await updateReservation(reservation.id, {
      payment: result.amount_received,
      ...(isCancel ? { status: 'cancelled' } : {}),
    });

    return result;
  },
);

export const checkoutReservations = depend(
  { capturePaymentIntents, getReservations, updateReservation, sleep },
  async({ capturePaymentIntents, getReservations, updateReservation, sleep }) => {
    await (await getReservations({
      where: {
        status: {
          in: ['reserved', 'checkin'],
        },
        checkout: {
          lte: new Date(),
        },
      },
    })).reduce(async(prev, reservation) => {
      await prev;
      if (reservation.status === 'reserved') {
        await capturePaymentIntents(reservation, true);
        await sleep(500);
      } else {
        await updateReservation(reservation.id, {
          status: 'checkout',
        });
      }
    }, Promise.resolve());
  },
);
