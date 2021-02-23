import { GetDefaultPaymentMethodUseCase } from '$/application/usecase/stripe/getDefaultPaymentMethod';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/infra/http/response';

describe('GetDefaultPaymentMethodUseCase', () => {
  it('get default payment method', async() => {
    expect(await (new GetDefaultPaymentMethodUseCase(
      new TestGuestRepository([getDummyGuestData()]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: { id: 'pm_test' },
    });
  });
});
