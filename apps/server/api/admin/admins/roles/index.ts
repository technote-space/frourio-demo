import type { AuthHeader } from '@frourio-demo/types';
import type { ListRole } from '$/packages/application/usecase/admin/admins/listRoles';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: ListRole;
  }
}
