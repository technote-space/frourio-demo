import type { RoomWithValidReservation } from '$/application/usecase/lock/rooms/find';
import type { Reservation } from '$/domain/database/reservation';

export type Methods = {
  get: {
    resBody: RoomWithValidReservation;
  };
  patch: {
    resBody: Reservation;
  }
}
