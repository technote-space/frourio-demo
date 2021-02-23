import { SendRoomKeyUseCase } from '$/packages/application/usecase/admin/dashboard/sendRoomKey';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { TestRoomKeyRepository } from '$/__tests__/__mocks__/infra/database/roomKey';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestMailRepository } from '$/__tests__/__mocks__/infra/mail';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('SendRoomKeyUseCase', () => {
  it('should send room key', async() => {
    expect(await (new SendRoomKeyUseCase(
      new TestReservationRepository([getDummyReservationData(getDummyRoomData(), getDummyGuestData())]),
      new TestRoomKeyRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute.inject({
      encryptQrInfo: () => 'qr',
      toDataURL: () => getPromiseLikeItem('url'),
    })(1)).toEqual({
      status: 202,
      body: {
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
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      },
    });
  });
});
