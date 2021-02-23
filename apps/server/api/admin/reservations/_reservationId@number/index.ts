import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { ReservationBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Reservation;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: ReservationBody;
    resBody: Reservation;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Reservation;
  }
}
