import type { Query } from '@technote-space/material-table';
import type { Room } from '$/packages/domain/database/room';
import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';
import { execute } from '$/packages/application/service/table';

@singleton()
export class SearchRoomUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(query: Query<Room>) {
    return this.response.success(await execute(this.repository, query, ['name'], ['price', 'number']));
  }
}
