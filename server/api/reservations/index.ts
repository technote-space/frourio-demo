import type { AuthHeader } from '$/types';
import type { Reservation, CreateReservationData, ReservationOrderByInput } from '$/repositories/reservation';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      page?: number;
      orderBy?: ReservationOrderByInput;
    };
    resBody: Reservation[];
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateReservationData;
    resBody: Reservation;
  }
}
