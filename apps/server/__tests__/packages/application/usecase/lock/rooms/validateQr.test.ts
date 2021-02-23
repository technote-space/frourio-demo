import { ValidateQrUseCase } from '$/packages/application/usecase/lock/rooms/validateQr';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { TestRoomKeyRepository } from '$/__tests__/__mocks__/infra/database/roomKey';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';
import { addDays, subDays } from 'date-fns';

describe('ValidateQrUseCase', () => {
  it('should validate key', async() => {
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'checkin',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key' });
    expect(await (new ValidateQrUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute.inject({
      decryptQrInfo: () => ({ reservationId: 1, roomId: 1, key: 'test key' }),
    })(1, 'test key')).toEqual({
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

  it('should fail to validate key (fail to decode)', async() => {
    expect(await (new ValidateQrUseCase(
      new TestReservationRepository(),
      new TestRoomKeyRepository(),
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute.inject({
      decryptQrInfo: () => undefined,
    })(1, 'test key')).toEqual({
      status: 400,
    });
  });

  it('should fail to validate key (invalid reservation)', async() => {
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'cancelled',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key' });
    expect(await (new ValidateQrUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute.inject({
      decryptQrInfo: () => ({ reservationId: 1, roomId: 1, key: 'test key' }),
    })(1, 'test key')).toEqual({
      status: 200,
      body: {
        result: false,
        message: '無効なQRコードです。',
      },
    });
  });

  it('should fail to validate key (invalid key)', async() => {
    const reserveRepository = new TestReservationRepository([getDummyReservationData(await getRoom(), await getGuest(), {
      status: 'checkin',
      checkin: subDays(new Date(), 1),
      checkout: addDays(new Date(), 1),
    })]);
    const roomKeyRepository = new TestRoomKeyRepository();
    await roomKeyRepository.create(await reserveRepository.find(1), { key: 'test key' });
    expect(await (new ValidateQrUseCase(
      reserveRepository,
      roomKeyRepository,
      new TestPaymentRepository(),
      new ResponseRepository(),
    )).execute.inject({
      decryptQrInfo: () => ({ reservationId: 1, roomId: 1, key: 'invalid key' }),
    })(1, 'test key')).toEqual({
      status: 200,
      body: {
        result: false,
        message: '無効なQRコードです。',
      },
    });
  });
});
