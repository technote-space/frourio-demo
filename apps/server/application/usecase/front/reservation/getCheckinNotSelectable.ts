import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import type { GuestAuthorizationPayload } from '$/application/service/auth';
import { singleton, inject } from 'tsyringe';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';

export type CheckinNotSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}

@singleton()
export class GetCheckinNotSelectableUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(roomId: number, start: Date, end: Date, user?: GuestAuthorizationPayload) {
    const reservations = await this.repository.list({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        checkin: {
          lt: end,
        },
        checkout: {
          gt: start,
        },
        status: {
          not: 'cancelled',
        },
        OR: user ? [
          { roomId },
          { guestId: user.id },
        ] : [
          { roomId },
        ],
      },
    });
    const dates: Array<number> = [...new Set(reservations.flatMap(reservation => eachDayOfInterval({
      start: startOfDay(reservation.checkin),
      end: startOfDay(subDays(reservation.checkout, 1)),
    })).map(date => date.valueOf()))].sort();
    const events: Array<CheckinNotSelectableEvent> = [];
    if (dates.length) {
      const createEvent = (start: number, end: number): CheckinNotSelectableEvent => ({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end + 86400000, 'yyyy-MM-dd'), // end is exclusive
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'background',
      });
      let start = dates[0], prev = dates[0];
      for (let index = 1; index < dates.length; ++index) {
        if (dates[index] - prev !== 86400000) {
          events.push(createEvent(start, prev));
          start = dates[index];
        }
        prev = dates[index];
      }
      events.push(createEvent(start, prev));
    }

    return this.response.success(events);
  }
}
