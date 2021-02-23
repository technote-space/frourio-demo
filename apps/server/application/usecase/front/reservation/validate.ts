import type { IResponseRepository } from '$/domain/http/response';
import { inject, singleton } from 'tsyringe';

@singleton()
export class ValidateUseCase {
  public constructor(@inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute() {
    return this.response.success(undefined);
  }
}
