import type { AuthHeader } from '$/types';
import type { Reservation, CreateReservationData } from '$/repositories/reservation';
import type { Query, QueryResult } from 'material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Reservation>;
    resBody: QueryResult<Reservation>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateReservationData;
    resBody: Reservation;
  }
}
