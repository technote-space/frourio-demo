import type { AuthHeader } from '$/types';
import type { CheckinReservation } from '$/domains/dashboard';
import type { Query, QueryResult } from 'material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      query?: Query<CheckinReservation>;
      date?: Date;
    };
    resBody: QueryResult<CheckinReservation>;
  }
}
