/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IMailRepository } from '$/packages/domain/mail';
import type { Reservation } from '$/packages/domain/database/reservation';

export class TestMailRepository implements IMailRepository {
  public constructor(private mock?: (...args: any[]) => Promise<boolean>) {
  }

  sendCancelledMail(reservation: Reservation): Promise<boolean> {
    return this.mock ? this.mock(reservation) as any : Promise.resolve(true);
  }

  sendReservedMail(reservation: Reservation): Promise<boolean> {
    return this.mock ? this.mock(reservation) as any : Promise.resolve(true);
  }

  sendRoomKeyMail(reservation: Reservation, key: string, qr: string): Promise<boolean> {
    return this.mock ? this.mock(reservation, key, qr) as any : Promise.resolve(true);
  }
}
