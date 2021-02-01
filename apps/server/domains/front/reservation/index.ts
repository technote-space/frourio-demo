import type { Room } from '$/repositories/room';
import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { CreateReservationBody } from './validators';
import type { GuestAuthorizationPayload } from '$/types';
import { depend } from 'velona';
import { differenceInCalendarDays, eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { getReservations, createReservation } from '$/repositories/reservation';
import { getRoom, getRooms } from '$/repositories/room';
import { updateGuest } from '$/repositories/guest';

export type CheckinNotSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}
export type CheckoutSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}

export const getSelectRooms = depend(
  { getRooms },
  async({ getRooms }): Promise<BodyResponse<Room[]>> => ({
    status: 200,
    body: await getRooms(),
  }),
);

export const getRoomInfo = depend(
  { getRoom },
  async({ getRoom }, id: number): Promise<BodyResponse<Room>> => ({
    status: 200,
    body: await getRoom(id),
  }),
);

export const getCheckinNotSelectable = depend(
  { getReservations },
  async({ getReservations }, roomId: number, start: Date, end: Date): Promise<BodyResponse<Array<CheckinNotSelectableEvent>>> => {
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

    return {
      status: 200,
      body: events,
    };
  },
);

export const getCheckoutSelectable = depend(
  { getReservations },
  async({ getReservations }, roomId: number, end: Date, checkin: Date): Promise<BodyResponse<Array<CheckoutSelectableEvent>>> => {
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
          gt: checkin,
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

    return {
      status: 200,
      body: events,
    };
  },
);

export const reserve = depend(
  { getRoom, createReservation, updateGuest },
  async(
    { getRoom, createReservation, updateGuest },
    body: CreateReservationBody,
    user?: GuestAuthorizationPayload,
  ): Promise<BodyResponse<Reservation>> => {
    const room = await getRoom(body.roomId);
    const checkin = new Date(body.checkin);
    const checkout = new Date(body.checkout);
    const nights = differenceInCalendarDays(checkout, checkin);
    const createData = {
      ...(user ? {
        guest: {
          connect: {
            id: user.id,
          },
        },
      } : {}),
      guestName: body.guestName,
      guestNameKana: body.guestNameKana,
      guestZipCode: body.guestZipCode,
      guestAddress: body.guestAddress,
      guestPhone: body.guestPhone,
      room: {
        connect: {
          id: body.roomId,
        },
      },
      roomName: room.name,
      number: body.number,
      amount: body.number * room.price * nights,
      checkin,
      checkout,
      status: 'reserved',
    };
    if (body.updateInfo && user?.id) {
      await updateGuest(user.id, {
        name: body.guestName,
        nameKana: body.guestNameKana,
        zipCode: body.guestZipCode,
        address: body.guestAddress,
        phone: body.guestPhone,
      });
    }

    return {
      status: 201,
      body: await createReservation(createData),
    };
  },
);
