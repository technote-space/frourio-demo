import type { CheckinNotSelectableEvent } from '$/domains/front/reservation';

export type Methods = {
  get: {
    query: {
      roomId: number;
      start: Date;
      end: Date;
    };
    resBody: CheckinNotSelectableEvent[];
  }
}
