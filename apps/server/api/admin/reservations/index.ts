import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { ListReservation } from '$/packages/application/usecase/admin/reservations/list';
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
