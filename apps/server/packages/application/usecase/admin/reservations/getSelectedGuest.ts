import type { Guest, IGuestRepository } from '$/packages/domain/database/guest';
import type { IResponseRepository } from '$/packages/domain/http/response';
import { singleton, inject } from 'tsyringe';

export type SelectedGuest = Pick<Guest, 'id' | 'name' | 'email'>;

@singleton()
export class GetSelectedGuestUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(id: number) {
    const guest = await this.repository.find(id);
    return this.response.success({
      id: guest.id,
      name: guest.name,
      email: guest.email,
    });
  }
}
