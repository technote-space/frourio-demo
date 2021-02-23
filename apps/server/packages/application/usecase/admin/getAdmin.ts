import type { IAdminRepository } from '$/packages/domain/database/admin';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { AdminAuthorizationPayload } from '$/packages/application/service/auth';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetAdminUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(user: AdminAuthorizationPayload) {
    return this.response.success(await this.repository.find(user.id));
  }
}
