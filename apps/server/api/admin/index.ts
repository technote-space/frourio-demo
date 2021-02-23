import type { AuthHeader } from '@frourio-demo/types';
import type { Admin } from '$/packages/domain/database/admin';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Admin;
  }
}
