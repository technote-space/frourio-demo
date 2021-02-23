import type { AuthHeader } from '@frourio-demo/types';
import type { SelectedRoom } from '$/packages/application/usecase/admin/reservations/getSelectedRoom';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
    };
    resBody: SelectedRoom;
  }
}
