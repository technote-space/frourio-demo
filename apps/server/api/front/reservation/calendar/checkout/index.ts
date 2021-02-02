import type { CheckoutSelectableEvent } from '$/domains/front/reservation';

export type Methods = {
  get: {
    query: {
      roomId: number;
      end: Date;
      checkin: Date;
    };
    resBody: CheckoutSelectableEvent[];
  }
}
