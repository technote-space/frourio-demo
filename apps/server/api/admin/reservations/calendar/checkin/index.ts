import type { AuthHeader } from '@frourio-demo/types';
import type { CheckinNotSelectableEvent } from '$/application/usecase/admin/reservations/getCheckinNotSelectable';

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
