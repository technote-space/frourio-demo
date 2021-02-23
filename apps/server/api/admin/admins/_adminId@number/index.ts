import type { AuthHeader } from '@frourio-demo/types';
import type { Admin } from '$/domain/database/admin';
import type { AdminBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Admin;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqFormat: FormData;
    reqBody: AdminBody;
    resBody: Admin;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Admin;
  };
}
