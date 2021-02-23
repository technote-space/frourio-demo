import type { IGuestRepository } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import type { IPaymentRepository } from '$/domain/payment';
import { singleton, inject } from 'tsyringe';

@singleton()
export class GetDefaultPaymentMethodUseCase {
  public constructor(
    @inject('IGuestRepository') private repository: IGuestRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(guestId: number) {
    return this.response.success({
      id: await this.payment.getDefaultPaymentMethod(await this.repository.find(guestId)),
    });
  }
}
