import type { AuthHeader } from '$/types';
import type { Admin } from '$/repositories/admin';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Admin;
  }
}
