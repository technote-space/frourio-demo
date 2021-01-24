import type { AuthHeader } from '$/types';
import type { SelectableRoom } from '$/domains/admin/dashboard';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: SelectableRoom[];
  }
}
