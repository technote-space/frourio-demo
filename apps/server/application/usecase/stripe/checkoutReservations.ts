import type { IReservationRepository } from '$/domain/database/reservation';
import type { IPaymentRepository } from '$/domain/payment';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { sleep } from '@frourio-demo/utils/misc';

@singleton()
export class CheckoutReservationsUseCase {
  public constructor(
    @inject('IReservationRepository') private repository: IReservationRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
  ) {
  }

  execute = depend(
    { sleep },
    async({ sleep }) => {
      await (await this.repository.list({
        where: {
          status: {
            in: ['reserved', 'checkin'],
          },
          checkout: {
            lte: new Date(),
          },
        },
      })).reduce(async(prev, reservation) => {
        await prev;
        if (reservation.status === 'reserved') {
          await this.payment.capturePaymentIntents(reservation, true);
          await sleep(500);
        } else {
          await this.repository.update(reservation.id, {
            status: 'checkout',
          });
        }
      }, Promise.resolve());
    },
  );
}
