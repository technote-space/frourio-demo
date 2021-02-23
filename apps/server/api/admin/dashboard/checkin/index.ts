import type { AuthHeader } from '@frourio-demo/types';
import type { CheckinReservation } from '$/packages/application/usecase/admin/dashboard/getCheckin';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { CheckinBody, SendRoomKeyBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      query: Query<CheckinReservation>;
      date?: Date;
    };
    resBody: QueryResult<CheckinReservation>;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CheckinBody;
    resBody: Reservation;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: SendRoomKeyBody;
    resBody: Reservation;
  };
}
