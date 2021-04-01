import type { Reservation } from '$/packages/domain/database/reservation';
import { MailRepository } from '$/packages/infra/mail';
import * as service from '$/packages/infra/mail/service';
import * as env from '$/config/env';

beforeEach(() => {
  jest.resetModules();
});

const repository = new MailRepository();

describe('sendReservedMail', () => {
  it('should call sendHtmlMail', async() => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });
    Object.defineProperty(env, 'SMTP_BCC', { value: 'bcc@example.com' });
    const spyOn = jest.spyOn(service, 'sendHtmlMail').mockReturnValue(Promise.resolve(true));
    expect(await repository.sendReservedMail({
      id: 123,
      guestEmail: 'guest@example.com',
      number: 2,
      amount: 10000,
      checkin: new Date('2000/01/01 15:00:00'),
      checkout: new Date('2000/01/03 10:00:00'),
    } as Reservation)).toBe(true);
    expect(spyOn).toBeCalledWith('guest@example.com', '予約完了', 'Reserved', {
      'reservation.id': 123,
      'reservation.guestEmail': 'guest@example.com',
      'reservation.number': '2人',
      'reservation.amount': '¥10,000',
      'reservation.checkin': '2000/01/01 15:00',
      'reservation.checkout': '2000/01/03 10:00',
    });
  });
});

describe('sendCancelledMail', () => {
  it('should call sendHtmlMail', async() => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });
    Object.defineProperty(env, 'SMTP_BCC', { value: 'bcc@example.com' });
    const spyOn = jest.spyOn(service, 'sendHtmlMail').mockReturnValue(Promise.resolve(true));
    expect(await repository.sendCancelledMail({
      id: 123,
      guestEmail: 'guest@example.com',
      number: 2,
      amount: 10000,
      checkin: new Date('2000/01/01 15:00:00'),
      checkout: new Date('2000/01/03 10:00:00'),
    } as Reservation)).toBe(true);
    expect(spyOn).toBeCalledWith('guest@example.com', '予約キャンセル', 'Cancelled', {
      'reservation.id': 123,
      'reservation.guestEmail': 'guest@example.com',
      'reservation.number': '2人',
      'reservation.amount': '¥10,000',
      'reservation.checkin': '2000/01/01 15:00',
      'reservation.checkout': '2000/01/03 10:00',
    });
  });
});

describe('sendPaidMail', () => {
  it('should call sendHtmlMail', async() => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });
    Object.defineProperty(env, 'SMTP_BCC', { value: 'bcc@example.com' });
    const spyOn = jest.spyOn(service, 'sendHtmlMail').mockReturnValue(Promise.resolve(true));
    expect(await repository.sendPaidMail({
      id: 123,
      guestEmail: 'guest@example.com',
      number: 2,
      amount: 10000,
      checkin: new Date('2000/01/01 15:00:00'),
      checkout: new Date('2000/01/03 10:00:00'),
    } as Reservation, 'paid')).toBe(true);
    expect(spyOn).toBeCalledWith('guest@example.com', '支払い完了', 'Paid', {
      'reservation.id': 123,
      'reservation.guestEmail': 'guest@example.com',
      'reservation.number': '2人',
      'reservation.amount': '¥10,000',
      'reservation.checkin': '2000/01/01 15:00',
      'reservation.checkout': '2000/01/03 10:00',
      'reservation.paid': 'paid',
    });
  });
});

describe('sendRoomKeyMail', () => {
  it('should call sendHtmlMail', async() => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });
    Object.defineProperty(env, 'SMTP_BCC', { value: 'bcc@example.com' });
    const spyOn = jest.spyOn(service, 'sendHtmlMail').mockReturnValue(Promise.resolve(true));
    expect(await repository.sendRoomKeyMail({
      id: 123,
      guestEmail: 'guest@example.com',
      number: 2,
      amount: 10000,
      checkin: new Date('2000/01/01 15:00:00'),
      checkout: new Date('2000/01/03 10:00:00'),
    } as Reservation, 'key', 'qr')).toBe(true);
    expect(spyOn).toBeCalledWith('guest@example.com', '入室情報のお知らせ', 'RoomKey', {
      'reservation.id': 123,
      'reservation.guestEmail': 'guest@example.com',
      'reservation.number': '2人',
      'reservation.amount': '¥10,000',
      'reservation.checkin': '2000/01/01 15:00',
      'reservation.checkout': '2000/01/03 10:00',
      'reservation.key': 'key',
      'reservation.qr': 'qr',
    });
  });
});