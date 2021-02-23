import type { Query } from '@technote-space/material-table';
import type { Guest } from '$/domain/database/guest';
import type { IGuestRepository } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute } from '$/application/service/table';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';

@singleton()
export class ListGuestsUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Guest>) {
    return this.response.success(await execute(this.repository, query, [...ACCOUNT_FIELDS.map(field => field.name), 'auth0Sub', 'paymentId'], []));
  }
}
