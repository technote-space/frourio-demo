import type { AuthHeader } from '@frourio-demo/types';
import type { Role } from '$/packages/domain/database/role';
import type { Query, QueryResult } from '@technote-space/material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Role>;
    resBody: QueryResult<Role>;
  }
}
