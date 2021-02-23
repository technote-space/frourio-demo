import type { AdminBody } from './validators';
import type { IAdminRepository } from '$/packages/domain/database/admin';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { processBody } from './service';

export class UpdateAdminUseCase {
  public constructor(private repository: IAdminRepository, private response: IResponseRepository) {
  }

  public async execute(id: number, data: AdminBody) {
    return this.response.success(await this.repository.update(id, await processBody(data)));
  }
}