import type { Reservation } from '$/repositories/reservation';
import { sendHtmlMail } from '$/service/mail/utils';
import { getReservationVariables } from '$/repositories/reservation';
import ReservedTemplate from '$/templates/Reserved.html';
import CancelledTemplate from '$/templates/Cancelled.html';
import RoomKeyTemplate from '$/templates/RoomKey.html';

export const sendReservedMail = async(reservation: Reservation) => sendHtmlMail(reservation.guestEmail, '予約完了', ReservedTemplate, getReservationVariables(reservation));

export const sendCancelledMail = async(reservation: Reservation) => sendHtmlMail(reservation.guestEmail, '予約キャンセル', CancelledTemplate, getReservationVariables(reservation));

export type ReservationWithKey = Reservation & {
  room: {
    key: string;
  }
}
export const sendRoomKeyMail = async(reservation: Reservation, key: string, qr: string) => sendHtmlMail(reservation.guestEmail, '入室情報のお知らせ', RoomKeyTemplate, getReservationVariables({
  ...reservation,
  key,
  qr,
}));
