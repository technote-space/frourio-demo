import { CheckinUseCase } from '$/packages/application/usecase/admin/dashboard/checkin';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('CheckinUseCase', () => {
  it('should checkin', async() => {
    expect(await (new CheckinUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { status: 'reserved' })]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute.inject({
      capturePaymentIntents: () => getPromiseLikeItem({ id: 1, status: 'checkin' }),
    })(1)).toEqual({
      status: 200,
      body: {
        'id': 1,
        'status': 'checkin',
      },
    });
  });

  it('should fail to checkin', async() => {
    expect(await (new CheckinUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { status: 'checkin' })]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 400,
      body: {
        message: 'Not found or invalid status.',
      },
    });
  });
});
