import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/packages/domain/database/reservation';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Reservation[]
  }
}
