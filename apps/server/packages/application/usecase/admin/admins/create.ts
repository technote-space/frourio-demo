import type { AdminBody } from './validators';
import type { IAdminRepository } from '$/packages/domain/database/admin';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { processBody } from './service';

@singleton()
export class CreateAdminUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(data: AdminBody) {
    return this.response.created(await this.repository.create(await processBody(data, true)));
  }
}
