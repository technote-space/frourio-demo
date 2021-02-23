import type { IGuestRepository, UpdateGuestData } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class UpdateGuestUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number, data: UpdateGuestData) {
    return this.response.success(await this.repository.update(id, data));
  }
}
