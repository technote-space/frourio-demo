import { startOfDay, addDays } from 'date-fns';
import { getPromiseLikeItem } from '$/__tests__/utils';
import {
  getFilterConstraints,
  getWhere,
  getOrderBy,
  execute,
  converter,
  parseQuery,
} from '$/packages/application/service/table';

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

  it('should create where with search word', () => {
    expect(getWhere<{ test: string; num: number; }>('search 123', ['test'], ['num'])).toEqual({
      AND: [
        {
          OR: [{
            test: {
              contains: 'search',
            },
          }],
        },
        {
          OR: [
            {
              num: 123,
            },
            {
              test: {
                contains: '123',
              },
            },
          ],
        },
      ],
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

  it('should create where with empty word', () => {
    expect(getWhere<{ test: string; created: Date }>(' ', ['test'], [])).toBeUndefined();
    expect(getWhere<{ test: string; created: Date }>(' ', ['test'], [], {
      date: new Date(),
      key: 'created',
    })).toEqual({
      AND: [{
        created: {
          gte: expect.any(Date),
          lt: expect.any(Date),
        },
      }],
    });
  });
});

describe('getOrderBy', () => {
  it('should return undefined', () => {
    expect(getOrderBy(undefined, 'asc')).toBeUndefined();
    expect(getOrderBy({ field: 'test' }, undefined)).toBeUndefined();
    expect(getOrderBy({}, 'desc')).toBeUndefined();
  });

  it('should return order by object', () => {
    expect(getOrderBy({ field: 'test' }, 'asc')).toEqual({
      test: 'asc',
    });
  });
});

describe('execute', () => {
  it('should return query result', async() => {
    const result = await execute({
      count: () => getPromiseLikeItem(0),
      list: () => getPromiseLikeItem([]),
    }, {
      filters: [],
      page: 0,
      pageSize: 10,
      totalCount: 10,
      search: '',
      orderBy: {},
      orderDirection: 'asc',
    }, [], []);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('totalCount');
    expect(result.data).toEqual([]);
    expect(result.page).toBe(0);
    expect(result.totalCount).toBe(0);
  });
});

describe('converter', () => {
  it('should convert', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const converted = converter(data => ({ ...data, test: 'test' }), { data, page: 0, totalCount: 10 });
    expect(converted.data).toHaveLength(2);
    expect(converted.data[0]).toHaveProperty('test');
    expect(converted.data[1]).toHaveProperty('test');
    expect(converted.data[0]['test']).toBe('test');
    expect(converted.data[1]['test']).toBe('test');
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
