import { startOfToday, startOfTomorrow } from 'date-fns';
import { isAxiosError, processUpdateData } from '@/utils/api';
import { getPriceCalc } from '@/utils/calc';
import { getEventDates } from '@/utils/calendar';
import { addDisplayName } from '@/utils/component';
import { ensureString, processLicenses } from '@/utils/license';
import { startWithUppercase, replaceVariables } from '@/utils/string';
import { getReplaceVariables, normalizeHalfFull } from '@/utils/value';
import { sleep } from '@/utils/misc';

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

describe('isAxiosError', () => {
  it('should return true', () => {
    expect(isAxiosError({ config: {}, request: {}, response: {} })).toBe(true);
  });

  it('should return false', () => {
    expect(isAxiosError({})).toBe(false);
    expect(isAxiosError(123)).toBe(false);
  });
});

describe('processUpdateData', () => {
  it('should drop timestamps', () => {
    expect(processUpdateData({
      updatedAt: 123,
      createdAt: 234,
      test1: 'test',
      test2: 345,
    })).toEqual({
      test1: 'test',
      test2: 345,
    });
  });
});

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
  it('should return event dates', () => {
    expect(getEventDates({
      getApi: () => ({
        getEvents: () => [
          {
            start: null,
            end: null,
          },
          {
            start: new Date('2020-02-01'),
            end: new Date('2020-02-02'),
          },
          {
            start: new Date('2020-01-01'),
            end: new Date('2020-01-10'),
          },
        ],
      }),
    })).toEqual([
      '2020-01-01',
      '2020-01-02',
      '2020-01-03',
      '2020-01-04',
      '2020-01-05',
      '2020-01-06',
      '2020-01-07',
      '2020-01-08',
      '2020-01-09',
      '2020-02-01',
    ]);
  });

  it('should return empty array if invalid calendar', () => {
    expect(getEventDates(null)).toHaveLength(0);
  });
});

describe('addDisplayName', () => {
  it('should add display name', () => {
    const component = addDisplayName('prefix', () => ({ type: '', props: {}, key: '' }));
    expect(component).toHaveProperty('displayName');
    expect(component['displayName']).toBe('prefix(Component)');
  });
});

describe('ensureString', () => {
  it('should return string', () => {
    expect(ensureString('test')).toBe('test');
    expect(ensureString(['test1', 'test2'])).toBe('test1, test2');
  });
});

describe('processLicenses', () => {
  it('should process licenses', () => {
    expect(processLicenses({})).toEqual([]);
    expect(processLicenses({
      test1: {
        name: 'test1',
        version: 'v1.2.3',
        licenses: 'MIT',
        repository: 'https://example.com',
        licenseText: 'This is license',
      },
      test2: {
        name: 'test2',
        version: 'v2',
        licenses: ['Test1', 'Test2'],
        licenseText: 'This is license',
      },
    })).toEqual([
      {
        name: 'test1',
        version: 'v1.2.3',
        licenses: 'MIT',
        repository: 'https://example.com',
        licenseText: 'This is license',
      },
      {
        name: 'test2',
        version: 'v2',
        licenses: 'Test1, Test2',
        repository: undefined,
        licenseText: 'This is license',
      },
    ]);
  });
});

describe('startWithUppercase', () => {
  it('should return string which starts with uppercase', () => {
    expect(startWithUppercase('')).toBe('');
    expect(startWithUppercase('test')).toBe('Test');
    expect(startWithUppercase('test-abc')).toBe('Test-abc');
    expect(startWithUppercase('test abc')).toBe('Test abc');
  });
});

describe('replaceVariables', () => {
  it('should replace variables', () => {
    expect(replaceVariables('', {})).toBe('');
    expect(replaceVariables('', { test: 1 })).toBe('');
    expect(replaceVariables('${test}abc${test}${test}xyz', { test: 1 })).toBe('1abc11xyz');
    expect(replaceVariables('${test1}abc${test}${test2}', { test1: 1, test2: undefined })).toBe('1abc${test}');
  });
});

describe('getReplaceVariables', () => {
  it('should return replace variables', () => {
    expect(getReplaceVariables({})).toEqual({});
    expect(getReplaceVariables({
      test1: 1,
      test2: 'test2',
      test3: undefined,
      test4: null,
      test5: jest.fn(),
    })).toEqual({
      test1: 1,
      test2: 'test2',
      test3: undefined,
      test4: null,
    });
    expect(getReplaceVariables({
      test1: 1,
      test2: 'test2',
      test3: undefined,
      test4: null,
      test5: jest.fn(),
    }, key => `test.${key}`)).toEqual({
      'test.test1': 1,
      'test.test2': 'test2',
      'test.test3': undefined,
      'test.test4': null,
    });
  });
});

describe('normalizeHalfFull', () => {
  it('should normalize half and full', () => {
    expect(normalizeHalfFull({})).toEqual({});
    expect(normalizeHalfFull({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
      test4: {},
    })).toEqual({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
      test4: {},
    });
    expect(normalizeHalfFull({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
    }, { toFull: ['test1', 'test2', 'test3'] })).toEqual({
      test1: 'ｔｅｓｔ１',
      test2: 'ｔｅｓｔ２',
      test3: '３',
    });
    expect(normalizeHalfFull({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
    }, { toHalf: ['test1', 'test2', 'test3'] })).toEqual({
      test1: 'test1',
      test2: 'test2',
      test3: '3',
    });
    expect(normalizeHalfFull({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
    }, { toHalf: ['test1'], toFull: ['test2'] })).toEqual({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
    });
    expect(normalizeHalfFull({
      test1: 'test1',
      test2: 'ｔｅｓｔ２',
      test3: 3,
    }, { toHalf: ['test2'], toFull: ['test1'] })).toEqual({
      test1: 'ｔｅｓｔ１',
      test2: 'test2',
      test3: 3,
    });
  });
});

describe('sleep', () => {
  it('should return promise', () => {
    expect(sleep(0)).toBeInstanceOf(Promise);
  });
});
