import type { Query } from '@technote-space/material-table';
import type { Room } from '$/domain/database/room';
import type { IRoomRepository } from '$/domain/database/room';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute } from '$/application/service/table';

@singleton()
export class ListRoomsUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Room>) {
    return this.response.success(await execute(this.repository, query, ['name'], ['price', 'number']));
  }
}
