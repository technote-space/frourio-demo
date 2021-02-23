import type { IRoomRepository, UpdateRoomData } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class UpdateRoomUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number, data: UpdateRoomData) {
    return this.response.success(await this.repository.update(id, data));
  }
}
