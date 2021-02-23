import type { Reservation } from '$/domain/database/reservation';

export type Methods = {
  patch: {
    resBody: Reservation;
  }
}
