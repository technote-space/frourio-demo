import type { IGuestRepository } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import type { GuestAuthorizationPayload } from '$/application/service/auth';
import type { UpdateGuestData } from '$/domain/database/guest';
import { singleton, inject } from 'tsyringe';

@singleton()
export class UpdateGuestInfoUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(user: GuestAuthorizationPayload, data: UpdateGuestData) {
    return this.response.success(await this.repository.update(user.id, data));
  }
}
