import type { AuthHeader } from '$/types';
import type { Admin } from '$/repositories/admin';
import type { AdminBody } from '$/domains/admins/validators';

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
