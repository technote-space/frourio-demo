import type { AuthHeader } from '@frourio-demo/types';
import type { SelectedGuest } from '$/packages/application/usecase/admin/reservations/getSelectedGuest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      guestId: number;
    };
    resBody: SelectedGuest
  }
}
