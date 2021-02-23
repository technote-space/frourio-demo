import type { IRoleRepository } from '$/packages/domain/database/role';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

export type ListRole = Record<string, string>;

@singleton()
export class ListRolesUseCase {
  public constructor(@inject('IRoleRepository') private repository: IRoleRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute() {
    return this.response.success(Object.assign({}, ...(await this.repository.list()).map(role => ({ [role.role]: role.name }))));
  }
}
