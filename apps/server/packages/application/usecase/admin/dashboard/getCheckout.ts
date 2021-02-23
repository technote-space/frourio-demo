import type { Query } from '@technote-space/material-table';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute } from '$/packages/application/service/table';

export type CheckoutReservation =
  Pick<Reservation, 'id' | 'code' | 'guestName' | 'guestNameKana' | 'roomName' | 'checkin' | 'checkout' | 'number' | 'status' | 'amount' | 'payment'>
  & {
  room?: {
    number: number;
    price: number;
  }
};

@singleton()
export class GetCheckoutUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<CheckoutReservation>, date?: Date) {
    return this.response.success(await execute(this.repository, query, [
      'guestName',
      'guestNameKana',
      'roomName',
    ], [], {
      select: {
        id: true,
        code: true,
        guestName: true,
        guestNameKana: true,
        roomName: true,
        checkin: true,
        checkout: true,
        number: true,
        status: true,
        amount: true,
        payment: true,
        room: {
          select: {
            number: true,
            price: true,
          },
        },
      },
    }, {
      date,
      key: 'checkout',
    }, {
      status: {
        not: 'cancelled',
      },
    }));
  }
}
