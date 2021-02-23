import { RoomRepository } from '$/infra/database/room';
import { getPromiseLikeItem } from '$/__tests__/utils';

const repository = new RoomRepository();

describe('getDelegate', () => {
  it('should return delegate', () => {
    expect(repository.getDelegate()).toHaveProperty('findFirst');
  });
});

describe('getModelName', () => {
  it('should return model name', () => {
    expect(repository.getModelName()).toBe('room');
  });
});

describe('list', () => {
  it('should return rooms', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const injected = repository.list.inject({
      prisma: { room: { findMany: mock } },
    });
    expect(await injected()).toEqual([{ id: 1 }]);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('count', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(3));
    const injected = repository.count.inject({
      prisma: { room: { count: mock } },
    });
    expect(await injected()).toBe(3);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('find', () => {
  it('should return room', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.find.inject({
      prisma: { room: { findFirst: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      rejectOnNotFound: true,
      where: { id: 123 },
    });
  });
});

describe('create', () => {
  it('should create room', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.create.inject({
      prisma: { room: { create: mock } },
    });
    expect(await injected({
      name: 'test name',
      number: 3,
      price: 10000,
    })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: {
        name: 'test name',
        number: 3,
        price: 10000,
      },
    });
  });
});

describe('update', () => {
  it('should update room', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.update.inject({
      prisma: { room: { update: mock } },
    });
    expect(await injected(123, { name: 'new name' })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: { name: 'new name' },
      where: { id: 123 },
    });
  });
});

describe('delete', () => {
  it('should delete room', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.delete.inject({
      prisma: { room: { delete: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({ where: { id: 123 } });
  });
});
