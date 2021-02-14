import type { CreatePaymentIntentsBody } from '$/validators';
import type Stripe from 'stripe';

export type Methods = {
  post: {
    reqBody: CreatePaymentIntentsBody;
    resBody: Stripe.PaymentIntent;
  }
}
