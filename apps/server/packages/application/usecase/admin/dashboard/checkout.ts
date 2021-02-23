import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class CheckoutUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    const reservation = await this.repository.find(id);
    if (reservation.status === 'checkin') {
      return this.response.success(await this.repository.update(id, {
        status: 'checkout',
      }));
    }

    return this.response.badRequest('Not found or invalid status.');
  }
}
