import { CheckoutUseCase } from '$/packages/application/usecase/admin/dashboard/checkout';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('CheckoutUseCase', () => {
  it('should checkout', async() => {
    expect(await (new CheckoutUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { status: 'checkin' })]),
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
        'status': 'checkout',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      },
    });
  });

  it('should fail to checkout', async() => {
    expect(await (new CheckoutUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { status: 'checkout' })]),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 400,
      body: {
        message: 'Not found or invalid status.',
      },
    });
  });
});
