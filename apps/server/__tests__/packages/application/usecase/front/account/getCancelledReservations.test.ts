import { GetCancelledReservationsUseCase } from '$/packages/application/usecase/front/account/getCancelledReservations';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('GetCancelledReservationsUseCase', () => {
  it('should get cancelled reservations', async() => {
    const guestRepository = new TestGuestRepository([getDummyGuestData()]);
    expect(await (new GetCancelledReservationsUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), await guestRepository.find(1), { status: 'cancelled' })]),
      new ResponseRepository(),
    )).execute({ id: 1 })).toEqual({
      status: 200,
      body: [{
        'id': 1,
        'code': expect.any(String),
        'amount': expect.any(Number),
        'guestId': 1,
        'guestAddress': expect.any(String),
        'guestEmail': expect.any(String),
        'guestName': expect.any(String),
        'guestNameKana': expect.any(String),
        'guestPhone': expect.any(String),
        'guestZipCode': expect.any(String),
        'number': expect.any(Number),
        'payment': expect.any(Number),
        'roomName': expect.any(String),
        'status': 'cancelled',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      }],
    });
  });
});
