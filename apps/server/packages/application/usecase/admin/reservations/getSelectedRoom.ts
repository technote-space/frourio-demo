import type { Room, IRoomRepository } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

export type SelectedRoom = Pick<Room, 'id' | 'name' | 'number' | 'price'>;

@singleton()
export class GetSelectedRoomUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    const room = await this.repository.find(id);

    return this.response.success({
      id: room.id,
      name: room.name,
      number: room.number,
      price: room.price,
    });
  }
}
