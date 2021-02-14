import type { BasicResponse, BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import Stripe from 'stripe';
import { getGuest, updateGuest } from '$/repositories/guest';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { logger } from '$/service/logging';
import { STRIPE_SECRET } from '$/utils/env';
import { CANCEL_PAYMENT_RATE } from '@frourio-demo/constants';

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 5,
});

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
  {
    stripe: stripe as { paymentIntents: { create: typeof stripe.paymentIntents.create } },
    getReservation,
  },
  async({
    stripe,
    getReservation,
  }, reservationId: number, paymentMethodsId: string): Promise<BodyResponse<Stripe.PaymentIntent>> => {
    logger.info('createPaymentIntents, reservation=%d, id=%s', reservationId, paymentMethodsId);
    const reservation = await getReservation(reservationId, {
      include: {
        guest: {
          select: {
            stripe: true,
          },
        },
      },
    }) as Reservation & {
      guest?: {
        stripe: string | null
      }
    };
    return {
      status: 202,
      body: await stripe.paymentIntents.create({
        amount: reservation.amount,
        currency: 'jpy',
        'payment_method_types': ['card'],
        customer: reservation.guest?.stripe ?? undefined,
        'payment_method': paymentMethodsId,
        'capture_method': 'manual',
      }),
    };
  },
);

export const capturePaymentIntents = depend(
  {
    stripe: stripe as { paymentIntents: { capture: typeof stripe.paymentIntents.capture } },
    getReservation,
    updateReservation,
  },
  async({
    stripe,
    getReservation,
    updateReservation,
  }, reservationId: number, isCancel: boolean): Promise<BodyResponse<Stripe.PaymentIntent>> => {
    const reservation = await getReservation(reservationId);
    logger.info('capturePaymentIntents, reservation=%d, payment=%d, id=%s, isCancel=%d', reservation.id, reservation.payment, reservation.paymentIntents, isCancel);
    if (reservation.payment || !reservation.paymentIntents) {
      return {
        status: 400,
        body: {
          message: 'すでにキャプチャ済み、もしくは有効な支払いが存在しません。',
        },
      };
    }

    const result = await stripe.paymentIntents.capture(reservation.paymentIntents, {
      ...(isCancel ? {
        'amount_to_capture': Math.ceil(reservation.amount * CANCEL_PAYMENT_RATE),
      } : {}),
    });
    logger.info('capturePaymentIntents, amount=%d, amount_received=%d', result.amount, result.amount_received);
    await updateReservation(reservation.id, {
      payment: result.amount_received,
    });

    return {
      status: 200,
      body: result,
    };
  },
);
