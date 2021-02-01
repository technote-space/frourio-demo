import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/repositories/reservation';
import type { ReservationBody } from '$/domains/admin/reservations/validators';

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
