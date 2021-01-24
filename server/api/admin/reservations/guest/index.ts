import type { AuthHeader } from '$/types';
import type { SelectedGuest } from '$/domains/admin/reservations';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      guestId: number;
    };
    resBody: SelectedGuest
  }
}
