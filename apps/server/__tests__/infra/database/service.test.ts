import { createHash, validateHash, createAdminPasswordHash, whereId } from '$/infra/database/service';

describe('createHash, validateHash', () => {
  it('should validate hash', () => {
    expect(validateHash('test', createHash('test'))).toBe(true);
  });
});

describe('createAdminPasswordHash', () => {
  it('should return undefined', () => {
    expect(createAdminPasswordHash()).toBeUndefined();
    expect(createAdminPasswordHash({ set: undefined })).toBeUndefined();
  });

  it('should return hash string', () => {
    expect(createAdminPasswordHash('test')).toEqual(expect.any(String));
    expect(createAdminPasswordHash({ set: 'test' })).toEqual(expect.any(String));
  });
});

describe('whereId', () => {
  it('should has id property', () => {
    expect(whereId(123)).toHaveProperty('id');
  });

  it('should not has id property', () => {
    expect(whereId(undefined)).not.toHaveProperty('id');
  });
});
