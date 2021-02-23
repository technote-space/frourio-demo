import { ListReservationsUseCase } from '$/packages/application/usecase/admin/reservations/list';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('ListReservationUseCase', () => {
  it('should list reservations', async() => {
    expect(await (new ListReservationsUseCase(
      new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest())]),
      new ResponseRepository(),
    )).execute(getQuery({
      orderBy: 'name',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
            id: 1,
            code: expect.any(String),
            roomId: 1,
            roomName: expect.any(String),
            number: expect.any(Number),
            amount: expect.any(Number),
            checkin: expect.any(Date),
            checkout: expect.any(Date),
            status: 'checkin',
            payment: 10000,
            guestId: 1,
            guestEmail: expect.any(String),
            guestName: expect.any(String),
            guestNameKana: expect.any(String),
            guestZipCode: expect.any(String),
            guestAddress: expect.any(String),
            guestPhone: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });
});
