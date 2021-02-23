import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IPaymentRepository } from '$/packages/domain/payment';
import { singleton, inject } from 'tsyringe';
import { cancelPaymentIntents } from '$/packages/application/usecase/stripe/service';

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
