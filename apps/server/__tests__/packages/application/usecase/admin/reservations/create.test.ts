import { CreateReservationUseCase } from '$/packages/application/usecase/admin/reservations/create';
import { TestReservationRepository } from '$/__tests__/__mocks__/infra/database/reservation';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('CreateReservationUseCase', () => {
  it('should create reservation', async() => {
    expect(await (new CreateReservationUseCase(
      new TestReservationRepository(),
      new TestGuestRepository([getDummyGuestData()]),
      new TestRoomRepository([getDummyRoomData()]),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute({
      guestId: 1,
      roomId: 1,
      checkin: '2020-01-01',
      checkout: '2020-01-10',
      number: 1,
    })).toEqual({
      status: 201,
      body: {
        id: 1,
        roomId: 1,
        roomName: expect.any(String),
        number: expect.any(Number),
        amount: expect.any(Number),
        checkin: expect.any(Date),
        checkout: expect.any(Date),
        status: expect.any(String),
        guestId: 1,
        guestEmail: expect.any(String),
        guestName: expect.any(String),
        guestNameKana: expect.any(String),
        guestZipCode: expect.any(String),
        guestAddress: expect.any(String),
        guestPhone: expect.any(String),
        paymentIntents: 'pi_test',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
