import { GetPaymentMethodsUseCase } from '$/application/usecase/stripe/getPaymentMethods';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/infra/http/response';

describe('GetPaymentMethodsUseCase', () => {
  it('get payment methods', async() => {
    expect(await (new GetPaymentMethodsUseCase(
      new TestGuestRepository([getDummyGuestData()]),
      new TestPaymentRepository({
        paymentMethods: [{
          id: 'pm_test',
          card: {
            brand: 'visa',
            expMonth: 2,
            expYear: 22,
            last4: '2222',
          },
        }],
      }),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: [{
        id: 'pm_test',
        card: {
          brand: 'visa',
          expMonth: 2,
          expYear: 22,
          last4: '2222',
        },
      }],
    });
  });
});
