import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import type { IPaymentRepository } from '$/domain/payment';
import { singleton, inject } from 'tsyringe';
import { cancelPaymentIntents } from '$/application/usecase/stripe/service';

@singleton()
export class CancelUseCase {
  public constructor(
    @inject('IReservationRepository') private repository: IReservationRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(id: number) {
    const reservation = await this.repository.find(id, {
      where: {
        status: {
          not: 'cancelled',
        },
      },
      rejectOnNotFound: false,
    });

    if (!reservation) {
      return this.response.badRequest('Not found or invalid status.');
    }

    return this.response.success(await cancelPaymentIntents(this.repository, this.payment, reservation));
  }
}
