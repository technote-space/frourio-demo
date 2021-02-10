import type { AuthHeader } from '@frourio-demo/types';
import type { CheckoutSelectableEvent } from '$/domains/front/reservation';

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
