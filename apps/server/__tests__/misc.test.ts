/* eslint-disable @typescript-eslint/no-explicit-any */
import { startOfDay, addDays } from 'date-fns';
import {
  parseQuery,
  processMultipartFormDataBody,
  getWhere,
  getFilterConstraints,
  createAdminPasswordHash,
} from '$/repositories/utils';
import { includeRoles } from '$/repositories/admin';
import { processRoleConnections, getAdminFilterConstraints } from '$/domains/admin/admins/utils';
import { fillCreateReservationData, fillUpdateReservationData } from '$/domains/admin/reservations';

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

describe('processMultipartFormDataBody', () => {
  it('should process json object', () => {
    expect(processMultipartFormDataBody({})).toEqual({});
    expect(processMultipartFormDataBody({
      test1: JSON.stringify({ test2: 3 }),
      test4: 5,
    })).toEqual({ test1: { test2: 3 }, test4: 5 });
    expect(processMultipartFormDataBody({
      test1: [JSON.stringify({ test2: 3 })],
      test4: 5,
    })).toEqual({ test1: [{ test2: 3 }], test4: 5 });
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

describe('includeRoles', () => {
  it('should contains roles property', () => {
    expect(includeRoles(undefined)).toEqual({ include: { roles: true } });
    expect(includeRoles({})).toEqual({ include: { roles: true } });
    expect(includeRoles({ include: { test: true } })).toEqual({ include: { test: true, roles: true } });
    expect(includeRoles({ select: { test: true } })).toEqual({ select: { test: true, roles: true } });
  });
});

describe('processRoleConnections', () => {
  it('should contains roles property', () => {
    expect(processRoleConnections({})).toEqual({ roles: { connect: [] } });
    expect(processRoleConnections({
      roles: [{ role: 'test1', name: 'test1' }, { role: 'test2', name: 'test2' }],
    })).toEqual({ roles: { connect: [{ role: 'test1' }, { role: 'test2' }] } });
  });
});

describe('getAdminFilterConstraints', () => {
  it('should return empty array', () => {
    expect(getAdminFilterConstraints()).toEqual([]);
    expect(getAdminFilterConstraints([])).toEqual([]);
  });

  it('should return constraints', () => {
    expect(getAdminFilterConstraints([{
      column: {
        field: 'roles',
      },
      value: ['dashboard', 'rooms'],
      operator: '=',
    }])).toEqual([{
      roles: {
        some: {
          role: {
            in: ['dashboard', 'rooms'],
          },
        },
      },
    }]);
    expect(getAdminFilterConstraints([{
      column: {
        field: 'test',
      },
      value: 123,
      operator: '=',
    }])).toEqual([{
      test: 123,
    }]);
    expect(getAdminFilterConstraints([
      {
        column: {
          field: 'test',
        },
        value: 123,
        operator: '=',
      },
      {
        column: {
          field: 'roles',
        },
        value: ['dashboard', 'rooms'],
        operator: '=',
      },
    ])).toEqual([
      {
        roles: {
          some: {
            role: {
              in: ['dashboard', 'rooms'],
            },
          },
        },
      },
      {
        test: 123,
      },
    ]);
  });
});

describe('fillCreateReservationData', () => {
  it('should throw error', async() => {
    await expect(
      fillCreateReservationData(
        {
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        jest.fn(),
        jest.fn(),
      ),
    ).rejects.toThrow('ゲストが選択されていません。');
  });

  it('should throw error', async() => {
    await expect(
      fillCreateReservationData(
        {
          guestId: 1,
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        jest.fn(() => Promise.resolve({
          id: 1,
          email: '',
          name: null,
          nameKana: null,
          zipCode: null,
          address: null,
          phone: null,
          auth0Sub: null,
          stripe: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        jest.fn(() => Promise.resolve({
          id: 1,
          name: '',
          key: '1111',
          trials: 0,
          number: 1,
          price: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      ),
    ).rejects.toThrow('必須項目が登録されていないゲストは指定できません。');
  });
});

describe('fillUpdateReservationData', () => {
  it('should throw error', async() => {
    await expect(
      fillUpdateReservationData(
        {
          guestId: 1,
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        jest.fn(() => Promise.resolve({
          id: 1,
          email: '',
          name: null,
          nameKana: null,
          zipCode: null,
          address: null,
          phone: null,
          auth0Sub: null,
          stripe: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        jest.fn(() => Promise.resolve({
          id: 1,
          name: '',
          key: '1111',
          trials: 0,
          number: 1,
          price: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      ),
    ).rejects.toThrow('必須項目が登録されていないゲストは指定できません。');
  });
});
