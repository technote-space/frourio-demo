import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { GuestAuthorizationPayload } from '$/packages/application/service/auth';
import { singleton, inject } from 'tsyringe';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';

export type CheckoutSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}

@singleton()
export class GetCheckoutSelectableUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(roomId: number, end: Date, checkin: Date, user?: GuestAuthorizationPayload) {
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
          gt: checkin,
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
    const events: Array<CheckoutSelectableEvent> = [];
    const startValue = startOfDay(checkin).valueOf();
    let prev = startValue;
    const endValue = startOfDay(end).valueOf();
    while (prev < endValue) {
      prev += 86400000;
      if (dates.includes(prev)) {
        events.push({
          start: format(startValue + 86400000, 'yyyy-MM-dd'), // exclude checkin date
          end: format(prev + 86400000, 'yyyy-MM-dd'), // end is exclusive
          allDay: true,
          color: '#a99',
          textColor: 'black',
          display: 'inverse-background',
        });
        break;
      }
    }
    if (!events.length) {
      events.push({
        start: format(startValue + 86400000, 'yyyy-MM-dd'), // exclude checkin date
        end: format(endValue, 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'inverse-background',
      });
    }

    return this.response.success(events);
  }
}
