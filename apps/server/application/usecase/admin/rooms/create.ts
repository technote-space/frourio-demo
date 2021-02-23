import type { IRoomRepository, CreateRoomData } from '$/domain/database/room';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class CreateRoomUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(data: CreateRoomData) {
    return this.response.created(await this.repository.create(data));
  }
}
