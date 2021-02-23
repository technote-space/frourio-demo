import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetSelectRoomsUseCase {
  public constructor(@inject('IRoomRepository') private repository: IRoomRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute() {
    return this.response.success(await this.repository.list());
  }
}
