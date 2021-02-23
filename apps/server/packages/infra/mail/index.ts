import type { IMailRepository } from '$/packages/domain/mail';
import type { Reservation } from '$/packages/domain/database/reservation';
import { sendHtmlMail } from '$/packages/infra/mail/service';
import { getReservationVariables } from '$/packages/infra/mail/service';
import ReservedTemplate from './templates/Reserved.html';
import CancelledTemplate from './templates/Cancelled.html';
import RoomKeyTemplate from './templates/RoomKey.html';

export class MailRepository implements IMailRepository {
  public async sendReservedMail(reservation: Reservation) {
    return sendHtmlMail(reservation.guestEmail, '予約完了', ReservedTemplate, getReservationVariables(reservation));
  }

  public async sendCancelledMail(reservation: Reservation) {
    return sendHtmlMail(reservation.guestEmail, '予約キャンセル', CancelledTemplate, getReservationVariables(reservation));
  }

  public async sendRoomKeyMail(reservation: Reservation, key: string, qr: string) {
    return sendHtmlMail(reservation.guestEmail, '入室情報のお知らせ', RoomKeyTemplate, getReservationVariables({
      ...reservation,
      key,
      qr,
    }));
  }
}
