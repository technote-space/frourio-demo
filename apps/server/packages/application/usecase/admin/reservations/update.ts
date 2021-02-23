import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IGuestRepository } from '$/packages/domain/database/guest';
import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { ReservationBody } from './validators';
import { singleton, inject } from 'tsyringe';
import { fillUpdateReservationData } from './service';

@singleton()
export class UpdateReservationUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IGuestRepository') private guestRepository: IGuestRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(id: number, data: ReservationBody) {
    // 更新時に Stripe 側の情報を更新するのは面倒 かつ 対応が個別に異なる可能性があるためシステムでは更新しない
    // 余裕があれば細かく動作を追加
    return this.response.success(await this.reservationRepository.update(
      id, await fillUpdateReservationData(data, this.guestRepository, this.roomRepository),
    ));
  }
}
