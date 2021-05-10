import type { Reservation } from '$/packages/domain/database/reservation';
import type { Guest } from '$/packages/domain/database/guest';
import type { IPaymentRepository, PaymentCustomer, PaymentMethod, PaymentIntent } from '$/packages/domain/payment';
import { depend } from 'velona';
import Stripe from 'stripe';
import { singleton, inject } from 'tsyringe';
import { logger } from '$/utils/logger';
import { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET } from '$/config/env';
import { CANCEL_PAYMENT_RATE } from '@frourio-demo/constants';
import { IReservationRepository } from '$/packages/domain/database/reservation';

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 5,
});

const convertCustomer = (customer: Stripe.Customer): PaymentCustomer => ({
  id: customer.id,
  email: customer.email ?? undefined,
  name: customer.name ?? undefined,
  defaultPaymentMethod: customer.deleted || !customer.invoice_settings.default_payment_method ? undefined :
    typeof customer.invoice_settings.default_payment_method === 'string' ? customer.invoice_settings.default_payment_method : customer.invoice_settings.default_payment_method.id,
});
const convertPaymentMethod = (paymentMethod: Stripe.PaymentMethod): PaymentMethod => ({
  id: paymentMethod.id,
  card: {
    brand: paymentMethod.card!.brand,
    expMonth: paymentMethod.card!.exp_month,
    expYear: paymentMethod.card!.exp_year,
    last4: paymentMethod.card!.last4,
    fingerprint: paymentMethod.card!.fingerprint ?? undefined,
  },
});
const convertPaymentIntent = (paymentIntent: Stripe.PaymentIntent): PaymentIntent => ({
  id: paymentIntent.id,
  amount: paymentIntent.amount,
  amountReceived: paymentIntent.amount_received,
  canceledAt: paymentIntent.canceled_at ?? undefined,
});

@singleton()
export class PaymentRepository implements IPaymentRepository {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository) {
  }

  getDefaultPaymentMethod = depend(
    { stripe: stripe as { customers: { retrieve: typeof stripe.customers.retrieve } } },
    async({ stripe }, guest: Pick<Guest, 'paymentId'>) => {
      if (!guest.paymentId) {
        return undefined;
      }

      const customer = await stripe.customers.retrieve(guest.paymentId);
      if (customer.deleted) {
        return undefined;
      }

      return convertCustomer(customer).defaultPaymentMethod;
    },
  );

  setDefaultPaymentMethod = depend(
    { stripe: stripe as { customers: { update: typeof stripe.customers.update } } },
    async({ stripe }, guest: Pick<Guest, 'paymentId'>, methodId: string) => {
      if (!guest.paymentId) {
        return;
      }

      return convertCustomer(await stripe.customers.update(guest.paymentId, {
        'invoice_settings': {
          'default_payment_method': methodId,
        },
      }));
    },
  );

  listPaymentMethods = depend(
    { stripe: stripe as { paymentMethods: { list: typeof stripe.paymentMethods.list } } },
    async({ stripe }, guest: Pick<Guest, 'paymentId'>) => guest.paymentId ? (await stripe.paymentMethods.list({
      customer: guest.paymentId,
      type: 'card',
    })).data.map(convertPaymentMethod) : [],
  );

  attachPaymentMethod = depend(
    {
      stripe: stripe as {
        paymentMethods: {
          retrieve: typeof stripe.paymentMethods.retrieve
          attach: typeof stripe.paymentMethods.attach
        }
        customers: { create: typeof stripe.customers.create }
      },
    },
    async({ stripe }, guest: Pick<Guest, 'email' | 'name' | 'phone' | 'paymentId'>, methodId: string) => {
      const method = await stripe.paymentMethods.retrieve(methodId);
      const getStripeCustomer = async() => {
        if (!guest.paymentId) {
          return (await stripe.customers.create({
            email: guest.email,
            ...(guest.name ? { name: guest.name } : {}),
            ...(guest.phone ? { phone: guest.phone } : {}),
          })).id;
        }

        return guest.paymentId;
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

  detachPaymentMethod = depend(
    { stripe: stripe as { paymentMethods: { detach: typeof stripe.paymentMethods.detach } } },
    async({ stripe }, id: string) => convertPaymentMethod(await stripe.paymentMethods.detach(id)),
  );

  createPaymentIntents = depend(
    { stripe: stripe as { paymentIntents: { create: typeof stripe.paymentIntents.create } } },
    async({ stripe }, amount: number, guest: { id?: number; paymentId?: string | null }, paymentMethodsId: string) => {
      return convertPaymentIntent(await stripe.paymentIntents.create({
        amount,
        currency: 'jpy',
        'payment_method_types': ['card'],
        customer: guest.paymentId ?? undefined,
        'payment_method': paymentMethodsId,
        'capture_method': 'manual',
        confirm: true,
      }));
    },
  );

  cancelPaymentIntents = depend(
    { stripe: stripe as { paymentIntents: { cancel: typeof stripe.paymentIntents.cancel } } },
    async({ stripe }, reservation: { id: number, paymentIntents: string | null }) => {
      if (reservation.paymentIntents) {
        await stripe.paymentIntents.cancel(reservation.paymentIntents);
        return true;
      }

      return false;
    },
  );

  capturePaymentIntents = depend(
    { stripe: stripe as { paymentIntents: { capture: typeof stripe.paymentIntents.capture } } },
    async({ stripe }, reservation: Pick<Reservation, 'id' | 'amount' | 'payment' | 'paymentIntents'>, isCancel?: boolean) => {
      if (reservation.payment || !reservation.paymentIntents) {
        return null;
      }

      return convertPaymentIntent(await stripe.paymentIntents.capture(reservation.paymentIntents, {
        ...(isCancel ? {
          'amount_to_capture': Math.ceil(reservation.amount * CANCEL_PAYMENT_RATE),
        } : {}),
      }));
    },
  );

  handleWebhook = depend(
    { stripe: stripe as { webhooks: { constructEvent: typeof stripe.webhooks.constructEvent } } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async({ stripe }, body: any, sig: string) => {
      try {
        const event = stripe.webhooks.constructEvent(body.raw, sig, STRIPE_WEBHOOK_SECRET);
        if (event.type === 'invoice.payment_failed') {
          const reservation = await this.repository.find(undefined, {
            where: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              paymentIntents: (event.data.object as any).payment_intent,
            },
          });
          await this.repository.update(reservation.id, {
            status: 'paymentFailed',
          });
        }
      } catch (err) {
        logger.error(err);
      }

      return { received: true };
    },
  );
}
