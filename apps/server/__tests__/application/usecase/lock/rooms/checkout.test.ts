import { CheckoutUseCase } from '$/application/usecase/lock/rooms/checkout';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';
import { addDays, subDays } from 'date-fns';

describe('CheckoutUseCase', () => {
  it('should checkout', async() => {
    expect(await (new CheckoutUseCase(
      new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
        status: 'checkin',
        checkin: subDays(new Date(), 1),
        checkout: addDays(new Date(), 1),
      })]),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: {
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
      },
    });
  });

  it('should fail to checkout', async() => {
    expect(await (new CheckoutUseCase(
      new TestReservationRepository(),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 400,
    });
  });
});
