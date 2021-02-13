import { encryptQrInfo, decryptQrInfo } from '$/utils/reservation';
import * as env from '$/utils/env';

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
