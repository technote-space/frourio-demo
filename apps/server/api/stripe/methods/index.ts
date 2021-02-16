import type { AuthHeader } from '@frourio-demo/types';
import type Stripe from 'stripe';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Stripe.PaymentMethod[]
  };
  put: {
    reqHeaders: AuthHeader;
    reqBody: { methodId: string }
  };
  delete: {
    reqHeaders: AuthHeader;
    reqBody: { methodId: string }
  };
}
