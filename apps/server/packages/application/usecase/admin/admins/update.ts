import type { AdminBody } from './validators';
import type { IAdminRepository } from '$/packages/domain/database/admin';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { processBody } from './service';

@singleton()
export class UpdateAdminUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number, data: AdminBody) {
    return this.response.success(await this.repository.update(id, await processBody(data, false)));
  }
}
