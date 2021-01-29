import type { BodyResponse, GuestAuthorizationPayload } from '$/types';
import type { Guest, UpdateGuestData } from '$/repositories/guest';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import { differenceInCalendarDays } from 'date-fns';
import { getGuest, updateGuest } from '$/repositories/guest';
import { getReservations, getReservation, updateReservation } from '$/repositories/reservation';

export type ReservationDetail = Reservation & {
  nights: number;
  room: {
    price: number
  };
}

export const getGuestInfo = depend(
  { getGuest },
  async({ getGuest }, user: GuestAuthorizationPayload): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await getGuest(user.id),
  }),
);

export const updateGuestInfo = depend(
  { updateGuest },
  async({ updateGuest }, user: GuestAuthorizationPayload, data: UpdateGuestData): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await updateGuest(user.id, data),
  }),
);

export const getReservedReservations = depend(
  { getReservations },
  async({ getReservations }, user: GuestAuthorizationPayload): Promise<BodyResponse<Reservation[]>> => ({
    status: 200,
    body: await getReservations({
      where: {
        guestId: user.id,
        status: 'reserved',
      },
      orderBy: {
        id: 'desc',
      },
    }),
  }),
);

export const getPaidReservations = depend(
  { getReservations },
  async({ getReservations }, user: GuestAuthorizationPayload): Promise<BodyResponse<Reservation[]>> => ({
    status: 200,
    body: await getReservations({
      where: {
        guestId: user.id,
        status: 'checkout',
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
    }),
  }),
);

export const getCancelledReservations = depend(
  { getReservations },
  async({ getReservations }, user: GuestAuthorizationPayload): Promise<BodyResponse<Reservation[]>> => ({
    status: 200,
    body: await getReservations({
      where: {
        guestId: user.id,
        status: 'cancelled',
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
    }),
  }),
);

export const getReservationDetail = depend(
  { getReservation },
  async({ getReservation }, id: number): Promise<BodyResponse<ReservationDetail>> => {
    const reservation = await getReservation(id, {
      include: {
        room: {
          select: {
            price: true,
          },
        },
      },
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
  { updateReservation },
  async({ updateReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await updateReservation(id, {
      status: 'cancelled',
    }),
  }),
);
