import type { BasicResponse, BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import Stripe from 'stripe';
import { getGuest, updateGuest } from '$/repositories/guest';
import { getReservations, updateReservation } from '$/repositories/reservation';
import {
  getStripeDefaultPaymentMethod,
  setDefaultPaymentMethod,
  listStripeDefaultPaymentMethods,
  attachPaymentMethodToCustomer,
  detachPaymentMethodFromCustomer,
  createStripePaymentIntents,
  cancelStripePaymentIntents,
  captureStripePaymentIntents,
} from '$/repositories/stripe';
import { logger } from '$/service/logging';
import { sleep } from '@frourio-demo/utils/misc';

export const getDefaultPaymentMethod = depend(
  { getStripeDefaultPaymentMethod, getGuest },
  async({ getStripeDefaultPaymentMethod, getGuest }, guestId: number): Promise<BodyResponse<{ id?: string }>> => ({
    status: 200,
    body: {
      id: await getStripeDefaultPaymentMethod(await getGuest(guestId)),
    },
  }),
);

export const getPaymentMethods = depend(
  { listStripeDefaultPaymentMethods, getGuest },
  async({
    listStripeDefaultPaymentMethods,
    getGuest,
  }, guestId: number): Promise<BodyResponse<Stripe.PaymentMethod[]>> => ({
    status: 200,
    body: await listStripeDefaultPaymentMethods(await getGuest(guestId)),
  }),
);

export const attachPaymentMethod = depend(
  { attachPaymentMethodToCustomer, setDefaultPaymentMethod, getGuest, updateGuest },
  async({
    attachPaymentMethodToCustomer,
    setDefaultPaymentMethod,
    getGuest,
    updateGuest,
  }, methodId: string, guestId: number): Promise<BasicResponse> => {
    logger.info('attachPaymentMethod, id=%s, guest=%d', methodId, guestId);
    const guest = await getGuest(guestId);
    const customer = await attachPaymentMethodToCustomer(methodId, guest);
    if (!guest.stripe) {
      await updateGuest(guest.id, { stripe: customer });
    }
    await setDefaultPaymentMethod(guest, methodId);

    return {
      status: 200,
    };
  },
);

export const detachPaymentMethod = depend(
  { detachPaymentMethodFromCustomer },
  async({ detachPaymentMethodFromCustomer }, id: string): Promise<BasicResponse> => {
    logger.info('detachPaymentMethod, id=%s', id);
    await detachPaymentMethodFromCustomer(id);
    return {
      status: 200,
    };
  },
);

export const createPaymentIntents = depend(
  { createStripePaymentIntents },
  async({ createStripePaymentIntents }, amount: number, guest: { id?: number; stripe?: string | null }, paymentMethodsId: string): Promise<Stripe.PaymentIntent> => {
    logger.info('createPaymentIntents, id=%s, guest=%d, amount=%d', paymentMethodsId, guest.id, amount);
    return createStripePaymentIntents(amount, guest, paymentMethodsId);
  },
);

export const cancelPaymentIntents = depend(
  { cancelStripePaymentIntents, updateReservation },
  async({
    cancelStripePaymentIntents,
    updateReservation,
  }, reservation: { id: number, paymentIntents: string | null }): Promise<Reservation> => {
    logger.info('cancelPaymentIntents, reservationId=%d, paymentIntents=%s', reservation.id, reservation.paymentIntents);
    await cancelStripePaymentIntents(reservation);
    return updateReservation(reservation.id, { status: 'cancelled' });
  },
);

export const capturePaymentIntents = depend(
  { captureStripePaymentIntents, updateReservation },
  async({
    captureStripePaymentIntents,
    updateReservation,
  }, reservation: Reservation, isCancel?: boolean): Promise<Reservation> => {
    logger.info('capturePaymentIntents, reservation=%d, payment=%d, id=%s, isCancel=%d', reservation.id, reservation.payment, reservation.paymentIntents, isCancel);
    const result = await captureStripePaymentIntents(reservation, isCancel);
    const status = isCancel ? 'cancelled' : 'checkin';
    if (result) {
      logger.info('capturePaymentIntents, amount=%d, amount_received=%d', result.amount, result.amount_received);
      return await updateReservation(reservation.id, {
        payment: result.amount_received,
        status,
      });
    }

    return updateReservation(reservation.id, {
      status,
    });
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
