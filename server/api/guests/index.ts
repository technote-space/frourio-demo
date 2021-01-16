import type { AuthHeader } from '$/types';
import type { Guest } from '$/repositories/guest';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { GuestBody } from '$/domains/guests/validators';

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
