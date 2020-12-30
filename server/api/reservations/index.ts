import type { AuthHeader } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { Query, QueryResult } from 'material-table';
import type { ListReservation } from '$/domains/reservations';
import type { ReservationBody } from '$/domains/reservations/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<ListReservation>;
    resBody: QueryResult<ListReservation>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: ReservationBody;
    resBody: Reservation;
  }
}
