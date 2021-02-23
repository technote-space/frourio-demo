import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/domain/database/guest';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { GuestBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Guest>;
    resBody: QueryResult<Guest>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: GuestBody;
    resBody: Guest;
  }
}
