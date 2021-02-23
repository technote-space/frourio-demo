import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { format } from 'date-fns';

export type RoomStatusEvent = {
  title: string;
  start: string;
  end: string;
  allDay: true;
  displayEventTime: false;
  startEditable: false;
  durationEditable: false;
  resourceEditable: false;
}

@singleton()
export class GetStatusCalendarEventsUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(roomId: number, start: Date, end: Date) {
    return this.response.success((await this.repository.list({
      select: {
        guestName: true,
        number: true,
        checkin: true,
        checkout: true,
      },
      where: {
        roomId,
        checkin: {
          lt: end,
        },
        checkout: {
          gt: start,
        },
        status: {
          not: 'cancelled',
        },
      },
    })).map(reservation => ({
      title: `${reservation.guestName} (${reservation.number}人)`,
      start: format(reservation.checkin, 'yyyy-MM-dd'),
      end: format(reservation.checkout, 'yyyy-MM-dd'),
      allDay: true,
      displayEventTime: false,
      startEditable: false,
      durationEditable: false,
      resourceEditable: false,
    } as RoomStatusEvent)));
  }
}
