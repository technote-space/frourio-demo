import type { IGuestRepository } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class DeleteGuestUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    return this.response.success(await this.repository.delete(id));
  }
}
