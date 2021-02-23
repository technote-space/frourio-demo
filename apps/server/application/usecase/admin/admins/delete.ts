import type { IAdminRepository } from '$/domain/database/admin';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class DeleteAdminUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    return this.response.success(await this.repository.delete(id));
  }
}
