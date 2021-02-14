import type { AuthHeader } from '@frourio-demo/types';
import type { Reservation } from '$/repositories/reservation';
import type { CreateReservationBody } from '$/validators';

export type Methods = {
  post: {
    reqHeaders?: AuthHeader;
    reqBody: CreateReservationBody;
    resBody: Reservation;
  }
}
