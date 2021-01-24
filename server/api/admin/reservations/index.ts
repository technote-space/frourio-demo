import type { AuthHeader } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { ListReservation } from '$/domains/admin/reservations';
import type { ReservationBody } from '$/domains/admin/reservations/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<ListReservation>;
    resBody: QueryResult<ListReservation>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: ReservationBody;
    resBody: Reservation;
  }
}
