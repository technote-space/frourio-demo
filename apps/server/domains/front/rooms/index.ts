import type { BodyResponse } from '$/types';
import type { Room } from '$/repositories/room';
import { depend } from 'velona';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { getRooms, getRoom } from '$/repositories/room';
import { getReservations } from '$/repositories/reservation';

export type NotSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}

export const list = depend(
  { getRooms },
  async({ getRooms }): Promise<BodyResponse<Room[]>> => ({
    status: 200,
    body: await getRooms(),
  }),
);

export const get = depend(
  { getRoom },
  async({ getRoom }, id: number): Promise<BodyResponse<Room>> => ({
    status: 200,
    body: await getRoom(id),
  }),
);

export const calendar = depend(
  { getReservations },
  async({ getReservations }, roomId: number, start: Date, end: Date): Promise<BodyResponse<NotSelectableEvent[]>> => {
    const reservations = await getReservations({
      select: {
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
    });
    const dates: Array<number> = [...new Set(reservations.flatMap(reservation => eachDayOfInterval({
      start: startOfDay(reservation.checkin),
      end: startOfDay(subDays(reservation.checkout, 1)),
    })).map(date => date.valueOf()))].sort();
    const events: Array<NotSelectableEvent> = [];
    if (dates.length) {
      const createEvent = (start: number, end: number): NotSelectableEvent => ({
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

    return {
      status: 200,
      body: events,
    };
  },
);
