import type { RoomWithValidReservation } from '$/domains/lock/rooms';
import type { Reservation } from '$/repositories/reservation';

export type Methods = {
  get: {
    resBody: RoomWithValidReservation;
  };
  delete: {
    resBody: Reservation;
  }
}
