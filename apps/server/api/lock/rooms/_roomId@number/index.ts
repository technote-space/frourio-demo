import type { RoomWithValidReservation } from '$/packages/application/usecase/lock/rooms/find';
import type { Reservation } from '$/packages/domain/database/reservation';

export type Methods = {
  get: {
    resBody: RoomWithValidReservation;
  };
  patch: {
    resBody: Reservation;
  }
}
