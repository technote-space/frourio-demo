import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import { differenceInCalendarDays } from 'date-fns';
import { getReservation } from '$/repositories/reservation';
import { sendCancelledMail } from '$/service/mail';
import { cancelPaymentIntents } from '$/domains/stripe';

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
  { getReservation, cancelPaymentIntents },
  async({ getReservation, cancelPaymentIntents }, code: string): Promise<BodyResponse<Reservation>> => {
    const reservation = await getReservation(undefined, {
      where: {
        code,
        status: {
          not: 'cancelled',
        },
      },
      rejectOnNotFound: false,
    });

    if (!reservation) {
      return {
        status: 400,
      };
    }

    const cancelled = await cancelPaymentIntents(reservation);
    await sendCancelledMail(cancelled);
    return {
      status: 200,
      body: cancelled,
    };
  },
);
