import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/domain/database/reservation';
import { CancelBody } from '$/validators';

export type Methods = {
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CancelBody;
    resBody: Reservation;
  }
}
