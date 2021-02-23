import type { Options } from 'nodemailer/lib/smtp-transport';
import type { Address } from 'nodemailer/lib/mailer';
import type { Reservation } from '$/packages/domain/database/reservation';

export type MailOptions = Options;
export type MailAddress = string | Address | Array<string | Address>;
export type MailSettings = {
  from: string | Address;
  to: MailAddress;
  bcc?: MailAddress;
  subject: string;
  text: string;
  html: string;
}

export interface IMailRepository {
  sendReservedMail(reservation: Reservation): Promise<boolean>;

  sendCancelledMail(reservation: Reservation): Promise<boolean>;

  sendRoomKeyMail(reservation: Reservation, key: string, qr: string): Promise<boolean>;
}
