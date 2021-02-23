import type { IGuestRepository } from '$/packages/domain/database/guest';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { GuestAuthorizationPayload } from '$/packages/application/service/auth';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetGuestInfoUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(user: GuestAuthorizationPayload) {
    return this.response.success(await this.repository.find(user.id));
  }
}
