import type { AuthHeader } from '@frourio-demo/types';
import type { PaymentMethod } from '$/packages/domain/payment';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: PaymentMethod[]
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
