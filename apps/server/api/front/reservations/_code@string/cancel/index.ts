import type { Reservation } from '$/packages/domain/database/reservation';

export type Methods = {
  patch: {
    resBody: Reservation;
  }
}
