import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/repositories/reservation';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';

export type Methods = {
  post: {
    reqHeaders?: AuthHeader;
    reqBody: CreateReservationBody;
    resBody: Reservation;
  }
}
