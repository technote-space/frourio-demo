import type { IRoomRepository } from '$/domain/database/room';
import type { IResponseRepository } from '$/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class ListRoomsUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute() {
    return this.response.success(await this.repository.list());
  }
}
