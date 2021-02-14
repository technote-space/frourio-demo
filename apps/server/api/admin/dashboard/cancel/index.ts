import type { AuthHeader } from '@frourio-demo/types';
import { Reservation } from '$/repositories/reservation';
import { CancelBody } from '$/validators';

export type Methods = {
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CancelBody;
    resBody: Reservation;
  }
}
