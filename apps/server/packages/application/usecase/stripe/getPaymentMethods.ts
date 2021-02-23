import type { IGuestRepository } from '$/packages/domain/database/guest';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IPaymentRepository } from '$/packages/domain/payment';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetPaymentMethodsUseCase {
  public constructor(
    @inject('IGuestRepository') private repository: IGuestRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(guestId: number) {
    return this.response.success(await this.payment.listPaymentMethods(await this.repository.find(guestId)));
  }
}
