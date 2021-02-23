import type { AuthHeader } from '@frourio-demo/types';
import type { CheckinNotSelectableEvent } from '$/application/usecase/front/reservation/getCheckinNotSelectable';

export type Methods = {
  get: {
    reqHeaders?: AuthHeader;
    query: {
      roomId: number;
      start: Date;
      end: Date;
    };
    resBody: CheckinNotSelectableEvent[];
  }
}
