import { getSkip, getCurrentPage } from '$/packages/application/service/pages';

describe('getSkip', () => {
  it('should get skip number', () => {
    expect(getSkip(10, 2)).toBe(20);
  });
});

describe('getCurrentPage', () => {
  it('should get current page number', () => {
    expect(getCurrentPage(10, 31, 3)).toBe(3);
    expect(getCurrentPage(10, 30, 3)).toBe(2);
    expect(getCurrentPage(10, 29, 3)).toBe(2);
    expect(getCurrentPage(10, 21, 3)).toBe(2);
    expect(getCurrentPage(10, 20, 3)).toBe(1);
    expect(getCurrentPage(10, 19, 3)).toBe(1);
    expect(getCurrentPage(10, 10, 3)).toBe(0);
    expect(getCurrentPage(10, 0, 3)).toBe(0);
  });
});
