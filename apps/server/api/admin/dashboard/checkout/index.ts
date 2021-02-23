import type { AuthHeader } from '@frourio-demo/types';
import type { CheckoutReservation } from '$/packages/application/usecase/admin/dashboard/getCheckout';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { Reservation } from '$/packages/domain/database/reservation';
import { CheckoutBody } from '$/validators';

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
