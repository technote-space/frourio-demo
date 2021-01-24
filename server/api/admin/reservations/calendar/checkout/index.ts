import type { AuthHeader } from '$/types';
import type { CheckoutSelectableEvent } from '$/domains/admin/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
      end: Date;
      checkin: Date;
      id?: number;
    };
    resBody: CheckoutSelectableEvent[];
  }
}
