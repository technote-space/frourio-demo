import type { IGuestRepository } from '$/domain/database/guest';
import type { IResponseRepository } from '$/domain/http/response';
import type { IPaymentRepository } from '$/domain/payment';
import { singleton, inject } from 'tsyringe';
import { logger } from '$/utils/logger';

@singleton()
export class AttachPaymentMethodUseCase {
  public constructor(
    @inject('IGuestRepository') private repository: IGuestRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(methodId: string, guestId: number) {
    logger.info('attachPaymentMethod, id=%s, guest=%d', methodId, guestId);
    const guest = await this.repository.find(guestId);
    const customer = await this.payment.attachPaymentMethod(guest, methodId);
    if (!guest.paymentId) {
      await this.repository.update(guest.id, { paymentId: customer });
    }
    await this.payment.setDefaultPaymentMethod(guest, methodId);

    return this.response.success(await this.payment.setDefaultPaymentMethod(guest, methodId));
  }
}
