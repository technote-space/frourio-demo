import type { AuthHeader } from '$/types';
import type { Reservation, UpdateReservationData } from '$/repositories/reservation';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Reservation;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: UpdateReservationData;
    resBody: Reservation;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Reservation;
  }
}
