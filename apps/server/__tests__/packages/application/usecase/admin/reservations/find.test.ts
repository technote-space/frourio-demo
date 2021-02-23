import { FindReservationUseCase } from '$/packages/application/usecase/admin/reservations/find';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('FindReservationUseCase', () => {
  it('should find reservation', async() => {
    expect(await (new FindReservationUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData())]),
      new ResponseRepository(),
    )).execute(1)).toEqual({
      status: 200,
      body: {
        id: 1,
        code: expect.any(String),
        roomName: expect.any(String),
        number: expect.any(Number),
        amount: expect.any(Number),
        checkin: expect.any(Date),
        checkout: expect.any(Date),
        status: 'checkin',
        payment: 10000,
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
