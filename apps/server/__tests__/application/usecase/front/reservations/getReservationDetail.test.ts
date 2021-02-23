import { GetReservationDetailUseCase } from '$/application/usecase/front/reservations/getReservationDetail';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';

describe('GetReservationDetailUseCase', () => {
  it('should get reservation detail', async() => {
    expect(await (new GetReservationDetailUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData(), { code: 'test code' })]),
      new ResponseRepository(),
    )).execute('test code')).toEqual({
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
        nights: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
