import type { Query, Filter } from '@technote-space/material-table';
import type { Admin } from '$/domain/database/admin';
import type { IAdminRepository } from '$/domain/database/admin';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { getFilterConstraints } from '$/application/service/table';
import { execute } from '$/application/service/table';

const getAdminFilterConstraints = (filters?: Filter<Admin>[]) => {
  if (!filters?.length) {
    return [];
  }

  const roleFilter = filters.find(filter => filter.column.field === 'roles' && !!filter.value.length);
  const constraints = getFilterConstraints(filters.filter(filter => filter.column.field !== 'roles'));
  if (roleFilter) {
    return [
      {
        roles: {
          some: {
            role: {
              in: roleFilter.value,
            },
          },
        },
      },
      ...constraints,
    ];
  }

  return constraints;
};

@singleton()
export class ListAdminsUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Admin>) {
    return this.response.success(await execute(this.repository, query, ['name', 'email'], [], undefined, undefined, ...getAdminFilterConstraints(query.filters)));
  }
}
