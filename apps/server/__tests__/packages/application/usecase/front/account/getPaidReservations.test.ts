import { GetPaidReservationsUseCase } from '$/packages/application/usecase/front/account/getPaidReservations';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('GetPaidReservationsUseCase', () => {
  it('should get paid reservations', async() => {
    expect(await (new GetPaidReservationsUseCase(
      new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), { status: 'checkout' })]),
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
        'roomId': 1,
        'roomName': expect.any(String),
        'status': 'checkout',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      }],
    });
  });
});
