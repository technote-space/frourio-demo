import { AttachPaymentMethodUseCase } from '$/packages/application/usecase/stripe/attachPaymentMethod';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('AttachPaymentMethodUseCase', () => {
  it('attach payment method', async() => {
    expect(await (new AttachPaymentMethodUseCase(
      new TestGuestRepository([getDummyGuestData()]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute('pm_test', 1)).toEqual({
      status: 200,
      body: undefined,
    });
  });

  it('attach payment method', async() => {
    expect(await (new AttachPaymentMethodUseCase(
      new TestGuestRepository([getDummyGuestData({paymentId: 'cus_test'})]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute('pm_test', 1)).toEqual({
      status: 200,
      body: undefined,
    });
  });
});
