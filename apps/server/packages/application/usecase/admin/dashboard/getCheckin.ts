import type { Query } from '@technote-space/material-table';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute, converter } from '$/packages/application/service/table';
import { isValidCheckinDateRange } from '$/packages/application/service/reservation';

export type CheckinReservation =
  Pick<Reservation, 'id' | 'code' | 'guestName' | 'guestNameKana' | 'guestPhone' | 'roomName' | 'checkin' | 'checkout' | 'status'>
  & {
  isValid: boolean;
};

@singleton()
export class GetCheckinUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<CheckinReservation>, date?: Date) {
    return this.response.success(converter(reservation => ({
      ...reservation,
      isValid: isValidCheckinDateRange(reservation.checkin, reservation.checkout, new Date()),
    }), await execute(this.repository, query, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [], {
      select: {
        id: true,
        code: true,
        guestName: true,
        guestNameKana: true,
        guestPhone: true,
        roomName: true,
        checkin: true,
        checkout: true,
        status: true,
      },
    }, {
      date,
      key: 'checkin',
    })));
  }
}
