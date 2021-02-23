import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { getValidReservation } from '$/application/service/reservation';

@singleton()
export class CheckoutUseCase {
  public constructor(
    @inject('IReservationRepository') private repository: IReservationRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { getValidReservation },
    async({ getValidReservation }, roomId: number) => {
      const reservation = await getValidReservation(this.repository, roomId, new Date());
      if (!reservation) {
        return this.response.badRequest();
      }

      return this.response.success(await this.repository.update(reservation.id, {
        status: 'checkout',
      }));
    },
  );
}
