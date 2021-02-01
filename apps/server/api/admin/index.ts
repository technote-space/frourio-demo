import type { AuthHeader } from '@frourio-demo/types';
import type { Admin } from '$/repositories/admin';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Admin;
  }
}
