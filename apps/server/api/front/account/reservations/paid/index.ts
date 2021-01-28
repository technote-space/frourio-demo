import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/repositories/reservation';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Reservation[]
  }
}
