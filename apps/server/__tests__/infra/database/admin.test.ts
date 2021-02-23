import { AdminRepository } from '$/infra/database/admin';
import { getPromiseLikeItem } from '$/__tests__/utils';
import * as env from '$/config/env';

const repository = new AdminRepository();

describe('getDelegate', () => {
  it('should return delegate', () => {
    expect(repository.getDelegate()).toHaveProperty('findFirst');
  });
});

describe('getModelName', () => {
  it('should return model name', () => {
    expect(repository.getModelName()).toBe('admin');
  });
});

describe('validate', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.validate.inject({
      validateHash: () => true,
      prisma: { admin: { findFirst: mock } },
    });
    expect(await injected('test@example.com', 'pass')).toBe(123);
    expect(mock).toBeCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should return undefined 1', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.validate.inject({
      validateHash: () => false,
      prisma: { admin: { findFirst: mock } },
    });
    expect(await injected('test@example.com', 'pass')).toBeUndefined();
    expect(mock).toBeCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should return undefined 2', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(null));
    const injected = repository.validate.inject({
      validateHash: () => true,
      prisma: { admin: { findFirst: mock } },
    });
    expect(await injected('test@example.com', 'pass')).toBeUndefined();
    expect(mock).toBeCalledWith({ where: { email: 'test@example.com' } });
  });
});

describe('list', () => {
  it('should return admins', async() => {
    Object.defineProperty(env, 'API_URL', { value: 'http://example.com' });
    const mock = jest.fn(() => getPromiseLikeItem([
      { id: 1, roles: [{ role: 'a', name: 'b' }], password: '1', icon: 'test.png' },
      { id: 2, password: '2', icon: 'http://example.com/icons/test.png' },
      { id: 3 },
    ]));
    const injected = repository.list.inject({
      prisma: { admin: { findMany: mock } },
    });
    expect(await injected()).toEqual([
      { id: 1, roles: [{ role: 'a', name: 'b' }], icon: 'http://example.com/icons/test.png' },
      { id: 2, roles: [], icon: 'http://example.com/icons/test.png' },
      { id: 3, roles: [] },
    ]);
    expect(mock).toBeCalledWith({
      include: {
        roles: true,
      },
    });
  });

  it('should return admins', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([]));
    const injected = repository.list.inject({
      prisma: { admin: { findMany: mock } },
    });
    expect(await injected({ include: { roles: true } })).toEqual([]);
    expect(mock).toBeCalledWith({
      include: {
        roles: true,
      },
    });
  });

  it('should return admins', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([]));
    const injected = repository.list.inject({
      prisma: { admin: { findMany: mock } },
    });
    expect(await injected({ select: { name: true } })).toEqual([]);
    expect(mock).toBeCalledWith({
      select: {
        name: true,
        roles: true,
      },
    });
  });

  it('should return admins', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([]));
    const injected = repository.list.inject({
      prisma: { admin: { findMany: mock } },
    });
    expect(await injected({})).toEqual([]);
    expect(mock).toBeCalledWith({
      include: {
        roles: true,
      },
    });
  });
});

describe('count', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(3));
    const injected = repository.count.inject({
      prisma: { admin: { count: mock } },
    });
    expect(await injected()).toBe(3);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('find', () => {
  it('should return admin', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.find.inject({
      prisma: { admin: { findFirst: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123, roles: [] });
    expect(mock).toBeCalledWith({
      include: { roles: true },
      rejectOnNotFound: true,
      where: { id: 123 },
    });
  });
});

describe('create', () => {
  it('should create admin', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.create.inject({
      prisma: { admin: { create: mock } },
    });
    expect(await injected({
      name: 'test name',
      email: 'test@example.com',
      password: 'pass',
    })).toEqual({ id: 123, roles: [] });
    expect(mock).toBeCalledWith({
      data: {
        name: 'test name',
        email: 'test@example.com',
        password: expect.any(String),
      },
    });
  });
});

describe('update', () => {
  it('should update admin', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.update.inject({
      prisma: { admin: { update: mock } },
    });
    expect(await injected(123, {
      password: 'new pass',
    })).toEqual({ id: 123, roles: [] });
    expect(mock).toBeCalledWith({
      data: { password: expect.any(String) },
      where: { id: 123 },
    });
  });
});

describe('delete', () => {
  it('should delete admin', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.delete.inject({
      prisma: { admin: { delete: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123, roles: [] });
    expect(mock).toBeCalledWith({ where: { id: 123 } });
  });
});
