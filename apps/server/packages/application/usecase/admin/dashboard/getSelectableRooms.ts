import type { Room } from '$/packages/domain/database/room';
import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

export type SelectableRoom = Pick<Room, 'id' | 'name'>;

@singleton()
export class GetSelectableRoomsUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute() {
    return this.response.success((await this.repository.list()).map(room => ({
      id: room.id,
      name: room.name,
    })));
  }
}
