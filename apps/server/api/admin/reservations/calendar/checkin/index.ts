import type { AuthHeader } from '@frourio-demo/types';
import type { CheckinNotSelectableEvent } from '$/domains/admin/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
      start: Date;
      end: Date;
      id?: number;
    };
    resBody: CheckinNotSelectableEvent[];
  }
}
