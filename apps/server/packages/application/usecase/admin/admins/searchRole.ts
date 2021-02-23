import type { Query } from '@technote-space/material-table';
import type { Role } from '$/packages/domain/database/role';
import type { IRoleRepository } from '$/packages/domain/database/role';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute } from '$/packages/application/service/table';

@singleton()
export class SearchRoleUseCase {
  public constructor(@inject('IRoleRepository') private repository: IRoleRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Role>) {
    return this.response.success(await execute(this.repository, query, ['name'], []));
  }
}
