import type { AuthHeader } from '@frourio-demo/types';
import { Reservation } from '$/repositories/reservation';
import { CancelBody } from '$/domains/admin/dashboard/validators';

export type Methods = {
  patch: {
    reqHeaders: AuthHeader;
    reqBody: CancelBody;
    resBody: Reservation;
  }
}
