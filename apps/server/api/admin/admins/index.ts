import type { AuthHeader } from '@frourio-demo/types';
import type { Admin } from '$/packages/domain/database/admin';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { AdminBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Admin>;
    resBody: QueryResult<Admin>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqFormat: FormData;
    reqBody: AdminBody;
    resBody: Admin;
  }
}
