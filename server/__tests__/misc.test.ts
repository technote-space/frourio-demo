import { startOfDay, addDays } from 'date-fns';
import { verifyAdmin } from '$/service/auth';
import { parseQuery, getWhere, getFilterConstraints } from '$/repositories/utils';

describe('verifyAdmin', () => {
  it('should return true if login api', async() => {
    const jwtVerify = jest.fn();
    expect(await verifyAdmin({ url: '/api/login', method: 'POST', jwtVerify } as any)).toBe(true);
    expect(jwtVerify).not.toBeCalled();
  });

  it('should return true if verified', async() => {
    const jwtVerify = jest.fn(() => ({
      id: 123,
      roles: [],
    }));
    expect(await verifyAdmin({ url: '/test', method: 'GET', jwtVerify } as any)).toBe(true);
    expect(jwtVerify).toBeCalledTimes(1);
  });

  it('should return false if failed to authorize', async() => {
    expect(await verifyAdmin({
      url: '/test', method: 'GET', jwtVerify: () => ({
        id: 0,
        roles: [],
      }),
    } as any)).toBe(false);

    expect(await verifyAdmin({
      url: '/test', method: 'GET', jwtVerify: () => ({
        id: 123,
        roles: [],
      }),
    } as any, ['settings'])).toBe(false);

    expect(await verifyAdmin({
      url: '/test', method: 'GET', jwtVerify: () => ({
        id: 123,
        roles: ['guest'],
      }),
    } as any, ['settings'])).toBe(false);
  });
});

describe('parseQuery', () => {
  it('should return undefined', () => {
    expect(parseQuery(undefined)).toBe(undefined);
    expect(parseQuery('')).toBe(undefined);
  });

  it('should parse query value', () => {
    expect(parseQuery(JSON.stringify({}))).toEqual({});

    expect(parseQuery(JSON.stringify({
      'filters[]': JSON.stringify({ column: 'test', operator: '=', value: '1' }),
    }))).toEqual({
      filters: [
        { column: 'test', operator: '=', value: '1' },
      ],
    });
    expect(parseQuery(JSON.stringify({
      'filters[]': [
        JSON.stringify({ column: 'test', operator: '=', value: '1' }),
      ],
    }))).toEqual({
      filters: [
        { column: 'test', operator: '=', value: '1' },
      ],
    });
    expect(parseQuery(JSON.stringify({
      'filters[]': 123,
    }))).toEqual({});

    expect(parseQuery({
      orderBy: JSON.stringify({ field: 'test' }),
    })).toEqual({
      orderBy: {
        field: 'test',
      },
    });

    expect(parseQuery({
      error: JSON.stringify({ message: 'test' }),
    })).toEqual({
      error: {
        message: 'test',
      },
    });

    expect(parseQuery({
      test1: '2020-01-01',
      test2: '0000-99-99',
    })).toEqual({
      test1: new Date('2020-01-01'),
      test2: '0000-99-99',
    });
  });
});

describe('getFilterConstraints', () => {
  it('should return empty array', () => {
    expect(getFilterConstraints()).toEqual([]);
    expect(getFilterConstraints([])).toEqual([]);
    expect(getFilterConstraints([{
      column: {
        field: 'test',
      },
      operator: '=',
      value: [],
    }])).toEqual([]);
  });

  it('should return filter constraints', () => {
    expect(getFilterConstraints([
      {
        column: {
          field: 'test1',
        },
        operator: '=',
        value: '123',
      },
      {
        column: {
          field: 'test2',
          type: 'numeric',
        },
        operator: '=',
        value: '123',
      },
      {
        column: {
          field: 'test3',
        },
        operator: '=',
        value: ['123'],
      },
    ])).toEqual([
      {
        test1: '123',
      },
      {
        test2: 123,
      },
      {
        test3: {
          in: ['123'],
        },
      },
    ]);
  });
});

describe('getWhere', () => {
  it('should create where with only additional condition', () => {
    expect(getWhere<{ test: string }>('search', [], [], undefined, {
      test: '1',
    })).toEqual({
      AND: [{ test: '1' }],
    });
  });

  it('should create where with search word and date', () => {
    expect(getWhere<{ test: string }>('search', ['test'], [], { date: new Date(), key: 'test' })).toEqual({
      AND: [
        {
          OR: [{
            test: {
              contains: 'search',
            },
          }],
        },
        {
          test: {
            gte: startOfDay(new Date()),
            lt: addDays(startOfDay(new Date()), 1),
          },
        }],
    });
  });
});
