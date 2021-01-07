import type { AuthHeader } from '$/types';
import type { CheckinNotSelectableEvent } from '$/domains/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
      start: Date;
      end: Date;
    };
    resBody: CheckinNotSelectableEvent[];
  }
}
