/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { startOfDay, addDays } from 'date-fns';
import { verifyAdmin, getRolesValue } from '$/service/auth';
import {
  parseQuery,
  parseBody,
  getWhere,
  getFilterConstraints,
  createAdminPasswordHash,
} from '$/repositories/utils';
import { saveFile } from '$/service/multipart';
import { includeRoles } from '$/repositories/admin';
import { processRoleConnections, getAdminFilterConstraints } from '$/domains/admin/admins/utils';
import { fillReservationData } from '$/domains/admin/reservations';

jest.mock('fs', () => ({
  ...jest.requireActual('fs') as {},
  promises: {
    ...jest.requireActual('fs').promises as {},
    writeFile: jest.fn(),
  },
}));

describe('verifyAdmin', () => {
  it('should return true if verified', async() => {
    const jwtVerify = jest.fn(() => ({
      id: 123,
      roles: ['settings', 'settings_detail', 'settings_create', 'settings_update', 'settings_delete'],
    }));
    expect(await verifyAdmin({ url: '/test', method: 'GET', jwtVerify } as any)).toBe(true);
    expect(await verifyAdmin({ url: '/test', method: 'GET', params: {}, jwtVerify } as any, 'settings')).toBe(true);
    expect(await verifyAdmin({
      url: '/test',
      method: 'GET',
      params: { testId: 234 },
      jwtVerify,
    } as any, 'settings')).toBe(true);
    expect(await verifyAdmin({
      url: '/test',
      method: 'POST',
      jwtVerify,
    } as any, 'settings')).toBe(true);
    expect(await verifyAdmin({
      url: '/test',
      method: 'PATCH',
      params: { testId: 234 },
      jwtVerify,
    } as any, 'settings')).toBe(true);
    expect(await verifyAdmin({
      url: '/test',
      method: 'DELETE',
      params: { testId: 234 },
      jwtVerify,
    } as any, 'settings')).toBe(true);
    expect(jwtVerify).toBeCalledTimes(6);
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
    } as any, 'settings')).toBe(false);

    expect(await verifyAdmin({
      url: '/test', method: 'GET', jwtVerify: () => ({
        id: 123,
        roles: ['guest'],
      }),
    } as any, 'settings')).toBe(false);

    expect(await verifyAdmin({
      url: '/test', method: 'GET', jwtVerify: () => {
        throw new Error();
      },
    } as any)).toBe(false);
  });
});

describe('getRolesValue', () => {
  it('should return empty', () => {
    expect(getRolesValue([])).toEqual([]);
  });

  it('should return all roles', () => {
    expect(getRolesValue([{
      domain: 'rooms', targets: ['all'],
    }])).toEqual([
      { role: 'rooms', name: 'Rooms' },
      { role: 'rooms_create', name: 'Create in Rooms' },
      { role: 'rooms_detail', name: 'Get detail in Rooms' },
      { role: 'rooms_update', name: 'Update in Rooms' },
      { role: 'rooms_delete', name: 'Delete in Rooms' },
    ]);
  });

  it('should return specified roles', () => {
    expect(getRolesValue([
      { domain: 'test1 domain', targets: ['create'] },
      { domain: 'test2 domain', targets: ['read'] },
      { domain: 'test3 domain', targets: ['update'] },
      { domain: 'test4 domain', targets: ['delete'] },
      { domain: 'test5 domain', targets: ['create', 'read', 'update', 'delete'] },
    ])).toEqual([
      { role: 'test1_domain', name: 'Test1 domain' },
      { role: 'test1_domain_create', name: 'Create in Test1 domain' },
      { role: 'test2_domain', name: 'Test2 domain' },
      { role: 'test2_domain_detail', name: 'Get detail in Test2 domain' },
      { role: 'test3_domain', name: 'Test3 domain' },
      { role: 'test3_domain_update', name: 'Update in Test3 domain' },
      { role: 'test4_domain', name: 'Test4 domain' },
      { role: 'test4_domain_delete', name: 'Delete in Test4 domain' },
      { role: 'test5_domain', name: 'Test5 domain' },
      { role: 'test5_domain_create', name: 'Create in Test5 domain' },
      { role: 'test5_domain_detail', name: 'Get detail in Test5 domain' },
      { role: 'test5_domain_update', name: 'Update in Test5 domain' },
      { role: 'test5_domain_delete', name: 'Delete in Test5 domain' },
    ]);
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

describe('parseBody', () => {
  it('should parse json object', () => {
    expect(parseBody({})).toEqual({});
    expect(parseBody({ test1: JSON.stringify({ test2: 3 }), test4: 5 })).toEqual({ test1: { test2: 3 }, test4: 5 });
    expect(parseBody({ test1: [JSON.stringify({ test2: 3 })], test4: 5 })).toEqual({ test1: [{ test2: 3 }], test4: 5 });
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

describe('saveFile', () => {
  it('should not process not multipart files', async() => {
    const spyOn = jest.spyOn(fs.promises, 'writeFile');

    expect(await saveFile({ test1: 'test1', test2: 2 })).toEqual({ test1: 'test1', test2: 2 });
    expect(spyOn).not.toBeCalled();
  });

  it('should process multipart files', async() => {
    expect(await saveFile({
      test1: { filename: 'test.png', toBuffer: jest.fn() },
      test2: 2,
      test3: { filename: 'test.jpg', toBuffer: jest.fn() },
    })).toEqual({
      test1: expect.stringMatching(/\.png$/),
      test2: 2,
      test3: expect.stringMatching(/\.jpg$/),
    });
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

describe('fillReservationData', () => {
  it('should throw error', async() => {
    await expect(fillReservationData({
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      jest.fn(() => Promise.resolve({
        id: 1,
        name: '',
        number: 1,
        price: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })))).rejects.toThrow('必須項目が登録されていないゲストは指定できません。');
  });
});
