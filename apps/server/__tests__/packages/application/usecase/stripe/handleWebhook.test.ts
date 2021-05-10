import { HandleWebhookUseCase } from '$/packages/application/usecase/stripe/handleWebhook';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('HandleWebhookUseCase', () => {
  it('attach payment method', async() => {
    expect(await (new HandleWebhookUseCase(
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute({}, '')).toEqual({
      status: 200,
      body: { received: true },
    });
  });
});
