import { getPromiseLikeItem } from '$/__tests__/utils';
import { isValidCheckinDateRange, getValidReservation } from '$/packages/application/service/reservation';
import { encryptQrInfo, decryptQrInfo } from '$/packages/application/service/qr';
import * as env from '$/config/env';

describe('isValidCheckinDateRange', () => {
  it('should return true', () => {
    expect(isValidCheckinDateRange.inject({
      isAfter: () => true,
      isBefore: () => true,
    })(new Date(), new Date(), new Date())).toBe(true);
  });

  it('should return false', () => {
    expect(isValidCheckinDateRange.inject({
      isAfter: () => true,
      isBefore: () => false,
    })(new Date(), new Date(), new Date())).toBe(false);
    expect(isValidCheckinDateRange.inject({
      isAfter: () => false,
      isBefore: () => true,
    })(new Date(), new Date(), new Date())).toBe(false);
    expect(isValidCheckinDateRange.inject({
      isAfter: () => false,
      isBefore: () => false,
    })(new Date(), new Date(), new Date())).toBe(false);
  });
});

describe('getValidReservation', () => {
  it('should get valid reservation', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 123 }]));
    expect(await getValidReservation.inject(deps => ({
      isValidCheckinDateRange: deps.isValidCheckinDateRange.inject({
        isAfter: () => true,
        isBefore: () => true,
      }),
    }))({
      list: mock,
    }, 1, new Date())).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: expect.any(Date),
        },
        checkout: {
          gt: expect.any(Date),
        },
        status: {
          in: ['reserved', 'checkin'],
        },
      },
    });
  });

  it('should return undefined', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 123 }]));
    expect(await getValidReservation.inject(deps => ({
      isValidCheckinDateRange: deps.isValidCheckinDateRange.inject({
        isAfter: () => false,
        isBefore: () => true,
      }),
    }))({
      list: mock,
    }, 1, new Date())).toBeUndefined();
    expect(mock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: expect.any(Date),
        },
        checkout: {
          gt: expect.any(Date),
        },
        status: {
          in: ['reserved', 'checkin'],
        },
      },
    });
  });
});

describe('encryptQrInfo, decryptQrInfo', () => {
  it('should encrypt and decrypt', () => {
    Object.defineProperty(env, 'CRYPTO_PASS', { value: 'pass' });
    Object.defineProperty(env, 'CRYPTO_SALT', { value: 'salt' });
    Object.defineProperty(env, 'CRYPTO_ALGO', { value: 'aes-256-cbc' });
    const info = {
      reservationId: 123,
      roomId: 321,
      key: 'KEY',
    };

    const encrypted = encryptQrInfo(info);
    const decrypted = decryptQrInfo(encrypted);

    expect(decrypted).toEqual(info);
  });

  it('should return undefined', () => {
    expect(decryptQrInfo('')).toBeUndefined();
  });
});
