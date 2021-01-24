import type { AuthHeader } from '$/types';
import type { SelectedRoom } from '$/domains/admin/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
    };
    resBody: SelectedRoom;
  }
}
