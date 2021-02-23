import { CancelUseCase } from '$/packages/application/usecase/admin/dashboard/cancel';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('CancelUseCase', () => {
  it('should cancel', async() => {
    expect(await (new CancelUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData())]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: {
        'id': 1,
        'code': expect.any(String),
        'amount': expect.any(Number),
        'guestAddress': expect.any(String),
        'guestEmail': expect.any(String),
        'guestName': expect.any(String),
        'guestNameKana': expect.any(String),
        'guestPhone': expect.any(String),
        'guestZipCode': expect.any(String),
        'number': expect.any(Number),
        'payment': 10000,
        'roomName': expect.any(String),
        'status': 'cancelled',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      },
    });
  });

  it('should fail to cancel', async() => {
    expect(await (new CancelUseCase(
      new TestReservationRepository(),
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
