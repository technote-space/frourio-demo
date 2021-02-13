import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import { isAfter, isBefore, set, startOfDay, endOfDay } from 'date-fns';
import { getReservations } from '$/repositories/reservation';

export const isValidCheckinDateRange = depend(
  { isAfter, isBefore },
  ({ isAfter, isBefore }, checkin: Date, checkout: Date, now: Date): boolean => {
    const values = { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 };
    return isAfter(now, set(checkin, values)) && isBefore(now, set(checkout, values));
  },
);
export const getValidReservation = depend(
  { getReservations, isValidCheckinDateRange },
  async({
    getReservations,
    isValidCheckinDateRange,
  }, roomId: number, now: Date, status = ['reserved', 'checkin']): Promise<Reservation | undefined> => (await getReservations({
    where: {
      roomId,
      checkin: {
        lt: endOfDay(now),
      },
      checkout: {
        gt: startOfDay(now),
      },
      status: {
        in: status,
      },
    },
  })).find(reservation => isValidCheckinDateRange(reservation.checkin, reservation.checkout, now)),
);
