import type { AuthHeader } from '$/types';
import type { CheckoutSelectableEvent } from '$/domains/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
      end: Date;
      checkin: Date;
    };
    resBody: CheckoutSelectableEvent[];
  }
}
