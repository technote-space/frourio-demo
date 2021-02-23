import type { IReservationRepository } from '$/domain/database/reservation';
import type { IGuestRepository } from '$/domain/database/guest';
import type { IRoomRepository } from '$/domain/database/room';
import type { IResponseRepository } from '$/domain/http/response';
import type { IPaymentRepository } from '$/domain/payment';
import type { ReservationBody } from './validators';
import { singleton, inject } from 'tsyringe';
import { processCreateStripe, fillCreateReservationData } from './service';

@singleton()
export class CreateReservationUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IGuestRepository') private guestRepository: IGuestRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(data: ReservationBody) {
    return this.response.created(await this.reservationRepository.create(
      await processCreateStripe(data, await fillCreateReservationData(data, this.guestRepository, this.roomRepository), this.guestRepository, this.payment),
    ));
  }
}
