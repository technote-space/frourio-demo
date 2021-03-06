import { GetCheckinUseCase } from '$/packages/application/usecase/admin/dashboard/getCheckin';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('GetCheckinUseCase', () => {
  it('should get checkin', async() => {
    expect(await (new GetCheckinUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData())]),
      new ResponseRepository(),
    )).execute(getQuery({
      orderBy: 'guestName',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
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
            'status': 'checkin',
            'isValid': expect.any(Boolean),
            'checkin': expect.any(Date),
            'checkout': expect.any(Date),
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date),
          },
        ],
      },
    });
  });
});
