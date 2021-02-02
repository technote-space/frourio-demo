import type { AuthHeader } from '@frourio-demo/types';
import type { SelectableRoom } from '$/domains/admin/dashboard';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: SelectableRoom[];
  }
}
