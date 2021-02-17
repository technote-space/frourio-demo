/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyAdmin, getRolesValue, verifyGuest } from '$/service/auth';

describe('verifyAdmin', () => {
  it('should return true if login api', async() => {
    const jwtVerify = jest.fn();
    expect(await verifyAdmin({ url: '/api/admin/login', method: 'POST', jwtVerify } as any)).toBe(true);
    expect(jwtVerify).not.toBeCalled();
  });

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

describe('verifyGuest', () => {
  it('should return true if verified', async() => {
    const jwtVerify = jest.fn(() => ({
      id: 123,
    }));
    expect(await verifyGuest({ url: '/test', method: 'GET', jwtVerify } as any)).toBe(true);
  });

  it('should return false if failed to authorize', async() => {
    expect(await verifyGuest({
      url: '/test', method: 'GET', jwtVerify: () => ({
        id: 0,
      }),
    } as any)).toBe(false);
    expect(await verifyGuest({
      url: '/test', method: 'GET', jwtVerify: () => null,
    } as any)).toBe(false);

    expect(await verifyGuest({
      url: '/test', method: 'GET', jwtVerify: () => {
        throw new Error();
      },
    } as any)).toBe(false);
  });
});
