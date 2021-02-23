import type { IGuestRepository, CreateGuestData } from '$/packages/domain/database/guest';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class CreateGuestUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(data: CreateGuestData) {
    return this.response.created(await this.repository.create(data));
  }
}
