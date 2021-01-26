import type { AuthHeader } from '@frourio-demo/types';
import type { CheckoutReservation } from '$/domains/admin/dashboard';
import type { Query, QueryResult } from '@technote-space/material-table';
import { Reservation } from '$/repositories/reservation';
import { CheckoutBody } from '$/domains/admin/dashboard/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      query: Query<CheckoutReservation>;
      date?: Date;
    };
    resBody: QueryResult<CheckoutReservation>;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CheckoutBody;
    resBody: Reservation;
  }
}
