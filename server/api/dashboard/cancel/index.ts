import type { AuthHeader } from '$/types';
import { Reservation } from '$/repositories/reservation';
import { ReservationStatusBody } from '$/domains/dashboard/validators';

export type Methods = {
  patch: {
    reqHeaders: AuthHeader;
    reqBody: ReservationStatusBody;
    resBody: Reservation;
  }
}
