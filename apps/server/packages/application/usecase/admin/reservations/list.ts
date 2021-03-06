import type { Query } from '@technote-space/material-table';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { getFilterConstraints } from '$/packages/application/service/table';
import { execute } from '$/packages/application/service/table';

export type ListReservation = Reservation & {
  room?: {
    number: number;
    price: number;
  }
}

@singleton()
export class ListReservationsUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Reservation>) {
    return this.response.success(await execute(this.repository, query, [
      'code',
      'guestEmail',
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
      'paymentIntents',
    ], ['amount', 'payment'], {
      include: {
        room: {
          select: {
            number: true,
            price: true,
          },
        },
      },
    }, undefined, ...getFilterConstraints(query.filters)));
  }
}
