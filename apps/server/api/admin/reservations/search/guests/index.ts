import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/packages/domain/database/guest';
import type { Query, QueryResult } from '@technote-space/material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Guest>;
    resBody: QueryResult<Guest>;
  };
}
