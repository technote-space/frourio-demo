import type { AuthHeader } from '$/types';
import type { Role } from '$/repositories/role';
import type { Query, QueryResult } from '@technote-space/material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Role>;
    resBody: QueryResult<Role>;
  }
}
