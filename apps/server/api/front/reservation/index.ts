import type { Reservation } from '$/repositories/reservation';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';

export type Methods = {
  post: {
    reqBody: CreateReservationBody;
    resBody: Reservation;
  }
}
