import type { AuthHeader } from '@frourio-demo/types';
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
