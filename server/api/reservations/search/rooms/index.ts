import type { AuthHeader } from '$/types';
import type { Room } from '$/repositories/room';
import type { Query, QueryResult } from 'material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Room>;
    resBody: QueryResult<Room>;
  };
}
