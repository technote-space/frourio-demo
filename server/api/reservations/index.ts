import type { AuthHeader } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { Query, QueryResult } from 'material-table';
import type { ReservationBody } from '$/domains/reservations/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Reservation>;
    resBody: QueryResult<Reservation>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: ReservationBody;
    resBody: Reservation;
  }
}
