import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { GuestAuthorizationPayload } from '$/packages/application/service/auth';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetPaidReservationsUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(user: GuestAuthorizationPayload) {
    return this.response.success(await this.repository.list({
      where: {
        guestId: user.id,
        status: {
          in: ['checkin', 'checkout'],
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
    }));
  }
}
