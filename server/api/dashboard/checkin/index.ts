import type { AuthHeader } from '$/types';
import type { CheckinReservation } from '$/domains/dashboard';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { Reservation } from '$/repositories/reservation';
import type { CheckinBody } from '$/domains/dashboard/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      query?: Query<CheckinReservation>;
      date?: Date;
    };
    resBody: QueryResult<CheckinReservation>;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CheckinBody;
    resBody: Reservation;
  }
}
