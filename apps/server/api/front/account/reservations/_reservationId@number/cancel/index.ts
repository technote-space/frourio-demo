import type { AuthHeader } from '@frourio-demo/types';
import { Reservation } from '$/repositories/reservation';

export type Methods = {
  patch: {
    reqHeaders: AuthHeader;
    resBody: Reservation;
  }
}
