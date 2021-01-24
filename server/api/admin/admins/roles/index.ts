import type { AuthHeader } from '$/types';
import type { ListRole } from '$/domains/admin/admins';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: ListRole;
  }
}