import { UpdateReservationUseCase } from '$/packages/application/usecase/admin/reservations/update';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('UpdateReservationUseCase', () => {
  it('should update reservation', async() => {
    const room = getDummyRoomData();
    const guest = getDummyGuestData();
    expect(await (new UpdateReservationUseCase(
      new TestReservationRepository([getDummyReservationData(room, guest)]),
      new TestGuestRepository([guest]),
      new TestRoomRepository([room]),
      new ResponseRepository(),
    )).execute(1, {
      guestId: 1,
      roomId: 1,
      checkin: '2020-01-01',
      checkout: '2020-01-10',
      number: 123,
    })).toEqual({
      status: 200,
      body: {
        id: 1,
        code: expect.any(String),
        roomName: expect.any(String),
        number: 123,
        amount: expect.any(Number),
        checkin: expect.any(Date),
        checkout: expect.any(Date),
        status: expect.any(String),
        guestEmail: expect.any(String),
        guestName: expect.any(String),
        guestNameKana: expect.any(String),
        guestZipCode: expect.any(String),
        guestAddress: expect.any(String),
        guestPhone: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
