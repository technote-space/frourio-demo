import { startOfToday, startOfTomorrow } from 'date-fns';
import { getPriceCalc } from '~/utils/calc';
import { getEventDates } from '~/utils/calendar';
import { ensureString } from '~/utils/license';

describe('getPriceCalc', () => {
  it('should return empty string', () => {
    expect(getPriceCalc(10000, 10, startOfTomorrow(), startOfToday(), 100000)).toBe('');
  });

  it('should return calc string', () => {
    expect(getPriceCalc(10000, 10, startOfToday(), startOfTomorrow(), 100000)).toBe('¥10000 * 10人 * 1泊');
    expect(getPriceCalc(10000, 10, startOfToday(), startOfTomorrow(), 200000)).toBe('¥100000 = ¥10000 * 10人 * 1泊');
  });
});

describe('getEventDates', () => {
  it('should return empty array if invalid calendar', () => {
    expect(getEventDates(null)).toHaveLength(0);
  });
});

describe('ensureString', () => {
  it('should return string', () => {
    expect(ensureString('test')).toBe('test');
    expect(ensureString(['test1', 'test2'])).toBe('test1, test2');
  });
});
