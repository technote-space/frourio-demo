import type { Room } from '$/repositories/room';
import type { Reservation } from '$/repositories/reservation';

export type Methods = {
  get: {
    resBody: Room;
  };
  delete: {
    resBody: Reservation;
  }
}
