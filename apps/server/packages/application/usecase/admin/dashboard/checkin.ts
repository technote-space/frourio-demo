import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IPaymentRepository } from '$/packages/domain/payment';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { depend } from 'velona';
import { singleton, inject } from 'tsyringe';
import { capturePaymentIntents } from '$/packages/application/usecase/stripe/service';

@singleton()
export class CheckinUseCase {
  public constructor(
    @inject('IReservationRepository') private repository: IReservationRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { capturePaymentIntents },
    async({ capturePaymentIntents }, id: number) => {
      const reservation = await this.repository.find(id);
      if (reservation.status === 'reserved') {
        return this.response.success(await capturePaymentIntents(this.repository, this.payment, reservation));
      }

      return this.response.badRequest('Not found or invalid status.');
    },
  );
}
