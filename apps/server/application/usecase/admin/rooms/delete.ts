import type { IRoomRepository } from '$/domain/database/room';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class DeleteRoomUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    return this.response.success(await this.repository.delete(id));
  }
}
