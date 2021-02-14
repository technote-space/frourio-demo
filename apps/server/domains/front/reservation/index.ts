import type { Room } from '$/repositories/room';
import type { BasicResponse, BodyResponse } from '$/types';
import type { Reservation, CreateReservationData } from '$/repositories/reservation';
import type { Guest } from '$/repositories/guest';
import type { CreateReservationBody } from './validators';
import type { GuestAuthorizationPayload } from '$/types';
import { depend } from 'velona';
import { differenceInCalendarDays, eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { toDataURL } from 'qrcode';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';
import { startWithUppercase } from '@frourio-demo/utils/string';
import { sleep } from '@frourio-demo/utils/misc';
import { getReservations, createReservation } from '$/repositories/reservation';
import { getRoom, getRooms } from '$/repositories/room';
import { getGuest, updateGuest } from '$/repositories/guest';
import { createRoomKey } from '$/repositories/roomKey';
import { encryptQrInfo } from '$/utils/reservation';
import { sendReservedMail, sendRoomKeyMail } from '$/service/mail';
import { getValidReservation } from '$/service/reservation';

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

export const getGuestInfo = depend(
  { getGuest },
  async({ getGuest }, user?: GuestAuthorizationPayload): Promise<BodyResponse<Guest | undefined>> => ({
    status: 200,
    body: user ? await getGuest(user.id) : undefined,
  }),
);

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
  async({ getReservations }, roomId: number, start: Date, end: Date, user?: GuestAuthorizationPayload): Promise<BodyResponse<Array<CheckinNotSelectableEvent>>> => {
    const reservations = await getReservations({
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
          {
            id: {
              not: user.id,
            },
          },
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

    return {
      status: 200,
      body: events,
    };
  },
);

export const getCheckoutSelectable = depend(
  { getReservations },
  async({ getReservations }, roomId: number, end: Date, checkin: Date, user?: GuestAuthorizationPayload): Promise<BodyResponse<Array<CheckoutSelectableEvent>>> => {
    const reservations = await getReservations({
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
          {
            id: {
              not: user.id,
            },
          },
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

    return {
      status: 200,
      body: events,
    };
  },
);

export const validate = (): BasicResponse => ({
  status: 200,
});

const getReservationGuest = (body: CreateReservationBody, guest: { email?: string }) => ({
  guestEmail: (body.guestEmail ?? guest.email)!,
  guestName: body.guestName,
  guestNameKana: body.guestNameKana,
  guestZipCode: body.guestZipCode,
  guestAddress: body.guestAddress,
  guestPhone: body.guestPhone,
});
export const reserve = depend(
  { getRoom, createReservation, getGuest, updateGuest },
  async(
    { getRoom, createReservation, getGuest, updateGuest },
    body: CreateReservationBody,
    user?: GuestAuthorizationPayload,
  ): Promise<BodyResponse<Reservation>> => {
    const room = await getRoom(body.roomId);
    const checkin = new Date(body.checkin);
    const checkout = new Date(body.checkout);
    const nights = differenceInCalendarDays(checkout, checkin);
    const guest = user?.id ? await getGuest(user.id, {
      select: Object.assign({}, ...RESERVATION_GUEST_FIELDS.map(field => ({ [field]: true }))),
    }) : {};
    const createData: CreateReservationData = {
      ...(user ? {
        guest: {
          connect: {
            id: user.id,
          },
        },
      } : {}),
      ...getReservationGuest(body, guest),
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

    if (user?.id) {
      RESERVATION_GUEST_FIELDS.forEach(field => {
        if (body.updateInfo || !guest[field]) {
          guest[field] = body[`guest${startWithUppercase(field)}`];
        }
      });
      await updateGuest(user.id, guest);
    }

    const reservation = await createReservation(createData);
    await sendReservedMail(reservation);
    return {
      status: 201,
      body: reservation,
    };
  },
);

export const sendRoomKey = depend(
  { getRooms, createRoomKey, getValidReservation, sleep, encryptQrInfo, toDataURL },
  async({ getRooms, createRoomKey, getValidReservation, sleep, encryptQrInfo, toDataURL }) => {
    await (await getRooms()).reduce(async(prev, room) => {
      await prev;
      const reservation = await getValidReservation(room.id, new Date());
      if (!reservation) {
        return;
      }

      await sleep(1000);
      const roomKey = await createRoomKey(reservation);
      await sendRoomKeyMail(reservation, roomKey.key, await toDataURL(encryptQrInfo({
        reservationId: reservation.id,
        roomId: reservation.roomId,
        key: roomKey.key,
      })));
    }, Promise.resolve());
  },
);
