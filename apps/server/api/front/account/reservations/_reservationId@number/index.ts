import type { AuthHeader } from '@frourio-demo/types';
import type { ReservationDetail } from '$/domains/front/account';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: ReservationDetail;
  };
}
