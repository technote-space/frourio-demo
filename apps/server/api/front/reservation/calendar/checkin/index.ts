import type { AuthHeader } from '@frourio-demo/types';
import type { CheckinNotSelectableEvent } from '$/domains/front/reservation';

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
