import { GuestRepository } from '$/packages/infra/database/guest';
import { getPromiseLikeItem } from '$/__tests__/utils';

const repository = new GuestRepository();

describe('getDelegate', () => {
  it('should return delegate', () => {
    expect(repository.getDelegate()).toHaveProperty('findFirst');
  });
});

describe('getModelName', () => {
  it('should return model name', () => {
    expect(repository.getModelName()).toBe('guest');
  });
});

describe('list', () => {
  it('should return guests', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const injected = repository.list.inject({
      prisma: { guest: { findMany: mock } },
    });
    expect(await injected()).toEqual([{ id: 1 }]);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('count', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(3));
    const injected = repository.count.inject({
      prisma: { guest: { count: mock } },
    });
    expect(await injected()).toBe(3);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('find', () => {
  it('should return guest', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.find.inject({
      prisma: { guest: { findFirst: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      rejectOnNotFound: true,
      where: { id: 123 },
    });
  });
});

describe('create', () => {
  it('should create guest', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.create.inject({
      prisma: { guest: { create: mock } },
    });
    expect(await injected({
      email: 'test@example.com',
    })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({ data: { email: 'test@example.com' } });
  });
});

describe('update', () => {
  it('should update guest', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.update.inject({
      prisma: { guest: { update: mock } },
    });
    expect(await injected(123, { email: 'new@example.com' })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: { email: 'new@example.com' },
      where: { id: 123 },
    });
  });
});

describe('delete', () => {
  it('should delete guest', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.delete.inject({
      prisma: { guest: { delete: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({ where: { id: 123 } });
  });
});

describe('deleteMany', () => {
  it('should delete guests', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ count: 3 }));
    const injected = repository.deleteMany.inject({
      prisma: { guest: { deleteMany: mock } },
    });
    expect(await injected([123, 234, 345])).toEqual({ count: 3 });
    expect(mock).toBeCalledWith({
      where: {
        OR: [
          { id: 123 },
          { id: 234 },
          { id: 345 },
        ],
      },
    });
  });
});
