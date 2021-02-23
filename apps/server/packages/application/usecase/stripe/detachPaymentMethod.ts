import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IPaymentRepository } from '$/packages/domain/payment';
import { singleton, inject } from 'tsyringe';
import { logger } from '$/utils/logger';

@singleton()
export class DetachPaymentMethodUseCase {
  public constructor(
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(id: string) {
    logger.info('detachPaymentMethod, id=%s', id);
    return this.response.success(await this.payment.detachPaymentMethod(id));
  }
}
