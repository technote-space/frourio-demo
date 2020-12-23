import type { Reservation, CreateReservationData, ReservationOrderByInput } from '$/repositories/reservation';

export type Methods = {
  get: {
    query?: {
      page?: number;
      orderBy?: ReservationOrderByInput;
    };
    resBody: Reservation[];
  };
  post: {
    reqBody: CreateReservationData;
    resBody: Reservation;
  }
}
