import type { AuthHeader } from '@frourio-demo/types';
import type { Room } from '$/domain/database/room';
import type { Query, QueryResult } from '@technote-space/material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Room>;
    resBody: QueryResult<Room>;
  };
}
