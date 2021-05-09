import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IPaymentRepository } from '$/packages/domain/payment';
import { singleton, inject } from 'tsyringe';

@singleton()
export class HandleWebhookUseCase {
  public constructor(
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  public async execute(body: any, sig: string) {
    return this.response.success(await this.payment.handleWebhook(body, sig));
  }
}
