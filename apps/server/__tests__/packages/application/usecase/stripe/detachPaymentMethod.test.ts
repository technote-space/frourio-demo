import { DetachPaymentMethodUseCase } from '$/packages/application/usecase/stripe/detachPaymentMethod';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('DetachPaymentMethodUseCase', () => {
  it('detach payment method', async() => {
    expect(await (new DetachPaymentMethodUseCase(
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute('pm_test')).toEqual({
      status: 200,
      body: {
        id: 'pm_test',
        card: {
          brand: 'visa',
          expMonth: 2,
          expYear: 22,
          last4: '2222',
        },
      },
    });
  });
});
