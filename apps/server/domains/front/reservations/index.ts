import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import { differenceInCalendarDays } from 'date-fns';
import { getReservation, updateReservation, getReservationVariables } from '$/repositories/reservation';
import CancelledTemplate from './templates/Cancelled.html';
import { sendHtmlMail } from '$/service/mail';

export type ReservationDetail = Reservation & {
  nights: number;
  room: {
    price: number
  };
}

export const getReservationDetail = depend(
  { getReservation },
  async({ getReservation }, code: string): Promise<BodyResponse<ReservationDetail>> => {
    const reservation = await getReservation(undefined, {
      include: {
        room: {
          select: {
            price: true,
          },
        },
      },
      where: { code },
    }) as ReservationDetail;
    const nights = differenceInCalendarDays(reservation.checkout, reservation.checkin);

    return {
      status: 200,
      body: {
        ...reservation,
        nights,
      },
    };
  },
);

export const cancel = depend(
  { getReservation, updateReservation },
  async({ getReservation, updateReservation }, code: string): Promise<BodyResponse<Reservation>> => {
    const reservation = await getReservation(undefined, {
      where: { code },
    });

    const cancelled = await updateReservation(reservation.id, {
      status: 'cancelled',
    });
    await sendHtmlMail(cancelled.guestEmail, '予約キャンセル', CancelledTemplate, getReservationVariables(cancelled));

    return {
      status: 200,
      body: cancelled,
    };
  },
);
