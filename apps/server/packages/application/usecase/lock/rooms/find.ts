import type { Room } from '$/packages/domain/database/room';
import type { Reservation } from '$/packages/domain/database/reservation';
import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { getValidReservation } from '$/packages/application/service/reservation';

export type RoomWithValidReservation = Room & {
  reservation?: Reservation;
}

@singleton()
export class FindRoomUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { getValidReservation },
    async({ getValidReservation }, id: number) => {
      return this.response.success({
        ...await this.roomRepository.find(id),
        reservation: await getValidReservation(this.reservationRepository, id, new Date()),
      } as RoomWithValidReservation);
    },
  );
}
