import type { AuthHeader } from '@frourio-demo/types';
import type { CheckoutSelectableEvent } from '$/application/usecase/admin/reservations/getCheckoutSelectable';

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
