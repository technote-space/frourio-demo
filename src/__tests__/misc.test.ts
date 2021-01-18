import { startOfToday, startOfTomorrow } from 'date-fns';
import { getPriceCalc } from '~/utils/calc';

describe('getPriceCalc', () => {
  it('should return empty string', () => {
    expect(getPriceCalc(10000, 10, startOfTomorrow(), startOfToday(), 100000)).toBe('');
  });

  it('should return calc string', () => {
    expect(getPriceCalc(10000, 10, startOfToday(), startOfTomorrow(), 100000)).toBe('¥10000 * 10人 * 1泊');
    expect(getPriceCalc(10000, 10, startOfToday(), startOfTomorrow(), 200000)).toBe('¥100000 = ¥10000 * 10人 * 1泊');
  });
});
