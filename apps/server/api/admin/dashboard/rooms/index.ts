import type { AuthHeader } from '@frourio-demo/types';
import type { SelectableRoom } from '$/application/usecase/admin/dashboard/getSelectableRooms';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: SelectableRoom[];
  }
}
