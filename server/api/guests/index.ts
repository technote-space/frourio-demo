import type { AuthHeader } from '$/types';
import type { Guest, CreateGuestData } from '$/repositories/guest';
import type { Query, QueryResult } from 'material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Guest>;
    resBody: QueryResult<Guest>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateGuestData;
    resBody: Guest;
  }
}
