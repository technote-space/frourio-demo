import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import { depend } from 'velona';
import { isAfter, isBefore, set, startOfDay, endOfDay } from 'date-fns';

export const isValidCheckinDateRange = depend(
  { isAfter, isBefore },
  ({ isAfter, isBefore }, checkin: Date, checkout: Date, now: Date): boolean => {
    const values = { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 };
    return isAfter(now, set(checkin, values)) && isBefore(now, set(checkout, values));
  },
);
export const getValidReservation = depend(
  { isValidCheckinDateRange },
  async({ isValidCheckinDateRange }, reservationRepository: Pick<IReservationRepository, 'list'>, roomId: number, now: Date): Promise<Reservation | undefined> => (await reservationRepository.list({
    where: {
      roomId,
      checkin: {
        lt: endOfDay(now),
      },
      checkout: {
        gt: startOfDay(now),
      },
      status: {
        in: ['reserved', 'checkin'],
      },
    },
  })).find(reservation => isValidCheckinDateRange(reservation.checkin, reservation.checkout, now)),
);
