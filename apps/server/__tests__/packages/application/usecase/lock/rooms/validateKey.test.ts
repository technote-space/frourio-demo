import { ValidateKeyUseCase } from '$/packages/application/usecase/lock/rooms/validateKey';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { TestRoomKeyRepository } from '$/__tests__/__mocks__/infra/database/roomKey';
import { TestMailRepository } from '$/__tests__/__mocks__/infra/mail';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getPromiseLikeItem } from '$/__tests__/utils';
import { addDays, subDays } from 'date-fns';
import { MAX_TRIALS } from '@frourio-demo/constants';

describe('ValidateKeyUseCase', () => {
  it('should validate key', async() => {
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'checkin',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key' });
    expect(await (new ValidateKeyUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute(1, 'test key')).toEqual({
      status: 200,
      body: {
        result: true,
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
          'roomId': 1,
          'roomName': expect.any(String),
          'payment': 10000,
          'status': 'checkin',
          'checkin': expect.any(Date),
          'checkout': expect.any(Date),
          'createdAt': expect.any(Date),
          'updatedAt': expect.any(Date),
        },
      },
    });
  });

  it('should fail to validate key', async() => {
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'checkin',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key' });
    expect(await (new ValidateKeyUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute(1, 'invalid key')).toEqual({
      status: 200,
      body: {
        result: false,
        message: '正しい番号を入力してください。',
      },
    });
  });

  it('should fail to validate key (not found reservation)', async() => {
    expect(await (new ValidateKeyUseCase(
      new TestReservationRepository(),
      new TestRoomKeyRepository(),
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute(1, 'test key')).toEqual({
      status: 200,
      body: {
        result: false,
        message: '有効な予約が見つかりません。',
      },
    });
  });

  it('should fail to validate key (resend email)', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(true));
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'checkin',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key', trials: MAX_TRIALS + 1 });
    expect(await (new ValidateKeyUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new TestMailRepository(mock),
      new ResponseRepository(),
    )).execute.inject({
      toDataURL: () => getPromiseLikeItem('url'),
      encryptQrInfo: () => getPromiseLikeItem('qr'),
    })(1, 'invalid key')).toEqual({
      status: 200,
      body: {
        result: false,
        message: '入室情報が再送されました。メールに記載された番号を入力してください。',
      },
    });
    expect(mock).toBeCalledWith({
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
