import { SendRoomKeyUseCase } from '$/packages/application/usecase/front/reservation/sendRoomKey';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestRoomKeyRepository } from '$/__tests__/__mocks__/infra/database/roomKey';
import { TestMailRepository } from '$/__tests__/__mocks__/infra/mail';
import { getPromiseLikeItem } from '$/__tests__/utils';
import { addDays, subDays } from 'date-fns';

describe('SendRoomKeyUseCase', () => {
  it('should send room key', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(true));
    const roomRepository = new TestRoomRepository([getDummyRoomData(), getDummyRoomData(), getDummyRoomData()]);
    expect(await (new SendRoomKeyUseCase(
      new TestReservationRepository([
        getDummyReservationData(await roomRepository.find(1), getDummyGuestData(), {
          checkin: subDays(new Date(), 1),
          checkout: addDays(new Date(), 1),
        }),
      ]),
      roomRepository,
      new TestRoomKeyRepository(),
      new TestMailRepository(mock),
    )).execute.inject({
      sleep: () => getPromiseLikeItem({}),
      toDataURL: () => getPromiseLikeItem('url'),
      encryptQrInfo: () => getPromiseLikeItem('qr'),
    })());
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith({
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
      'roomId': 1,
      'roomName': expect.any(String),
      'payment': 10000,
      'status': 'checkin',
      'checkin': expect.any(Date),
      'checkout': expect.any(Date),
      'createdAt': expect.any(Date),
      'updatedAt': expect.any(Date),
    }, expect.any(String), 'url');
  });
});
