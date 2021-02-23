import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import type { GuestAuthorizationPayload } from '$/application/service/auth';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetCancelledReservationsUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(user: GuestAuthorizationPayload) {
    return this.response.success(await this.repository.list({
      where: {
        guestId: user.id,
        status: 'cancelled',
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
    }));
  }
}
