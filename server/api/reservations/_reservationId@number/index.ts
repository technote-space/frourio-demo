import type { Reservation, UpdateReservationData } from '$/repositories/reservation';

export type Methods = {
  get: {
    resBody: Reservation;
  };
  patch: {
    reqBody: UpdateReservationData;
    resBody: Reservation;
  };
  delete: {
    resBody: Reservation;
  }
}
