import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IPaymentRepository } from '$/packages/domain/payment';
import type { IMailRepository } from '$/packages/domain/mail';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { cancelPaymentIntents } from '$/packages/application/usecase/stripe/service';

@singleton()
export class CancelUseCase {
  public constructor(
    @inject('IReservationRepository') private repository: IReservationRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IMailRepository') private mail: IMailRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { cancelPaymentIntents },
    async({ cancelPaymentIntents }, code: string) => {
      const reservation = await this.repository.find(undefined, {
        where: {
          code,
          status: {
            not: 'cancelled',
          },
        },
        rejectOnNotFound: false,
      });
      if (!reservation) {
        return this.response.badRequest();
      }

      const cancelled = await cancelPaymentIntents(this.repository, this.payment, reservation);
      await this.mail.sendCancelledMail(cancelled);
      return this.response.success(cancelled);
    },
  );
}
