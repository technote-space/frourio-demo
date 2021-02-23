import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/domain/database/reservation';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { ListReservation } from '$/application/usecase/admin/reservations/list';
import type { ReservationBody } from '$/validators';

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
