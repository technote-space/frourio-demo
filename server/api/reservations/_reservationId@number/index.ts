import type { AuthHeader } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { ReservationBody } from '$/domains/reservations/validators';

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
