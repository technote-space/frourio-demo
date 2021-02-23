import type { AuthHeader } from '@frourio-demo/types';
import type { CheckoutSelectableEvent } from '$/packages/application/usecase/front/reservation/getCheckoutSelectable';

export type Methods = {
  get: {
    reqHeaders?: AuthHeader;
    query: {
      roomId: number;
      end: Date;
      checkin: Date;
    };
    resBody: CheckoutSelectableEvent[];
  }
}
