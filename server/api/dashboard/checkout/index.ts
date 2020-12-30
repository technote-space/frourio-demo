import type { AuthHeader } from '$/types';
import type { CheckoutReservation } from '$/domains/dashboard';
import type { Query, QueryResult } from 'material-table';
import { Reservation } from '$/repositories/reservation';
import { ReservationStatusBody } from '$/domains/dashboard/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      query?: Query<CheckoutReservation>;
      date?: Date;
    };
    resBody: QueryResult<CheckoutReservation>;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: ReservationStatusBody;
    resBody: Reservation;
  }
}
