import { CancelUseCase } from '$/application/usecase/front/reservations/cancel';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestMailRepository } from '$/__tests__/__mocks__/infra/mail';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/infra/http/response';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('CancelUseCase', () => {
  it('should cancel reservation', async() => {
    expect(await (new CancelUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { code: 'test code' })]),
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute.inject({
      cancelPaymentIntents: () => getPromiseLikeItem({ id: 1, status: 'cancelled' }),
    })('test code')).toEqual({
      status: 200,
      body: {
        id: 1,
        status: 'cancelled',
      },
    });
  });

  it('should fail to cancel', async() => {
    expect(await (new CancelUseCase(
      new TestReservationRepository(),
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute('test code')).toEqual({
      status: 400,
    });
  });
});
