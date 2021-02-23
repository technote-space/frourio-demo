import { FindRoomUseCase } from '$/application/usecase/lock/rooms/find';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';
import { addDays, subDays } from 'date-fns';

describe('FindRoomUseCase', () => {
  it('should find room', async() => {
    const roomRepository = new TestRoomRepository([getDummyRoomData()])
    expect(await (new FindRoomUseCase(
      new TestReservationRepository([getDummyReservationData(await roomRepository.find(1), await getGuest(), {
        status: 'checkin',
        checkin: subDays(new Date(), 1),
        checkout: addDays(new Date(), 1),
      })]),
      roomRepository,
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        name: expect.any(String),
        number: expect.any(Number),
        price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        reservation: {
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
          'status': 'checkin',
          'checkin': expect.any(Date),
          'checkout': expect.any(Date),
          'createdAt': expect.any(Date),
          'updatedAt': expect.any(Date),
        }
      },
    });
  });
});
