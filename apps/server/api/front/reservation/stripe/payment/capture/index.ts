import type { CapturePaymentIntentsBody } from '$/validators';
import type Stripe from 'stripe';

export type Methods = {
  post: {
    reqBody: CapturePaymentIntentsBody;
    resBody: Stripe.PaymentIntent;
  }
}
