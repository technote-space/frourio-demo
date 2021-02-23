import { ReservationRepository } from '$/infra/database/reservation';
import { getPromiseLikeItem } from '$/__tests__/utils';

const repository = new ReservationRepository();

describe('getDelegate', () => {
  it('should return delegate', () => {
    expect(repository.getDelegate()).toHaveProperty('findFirst');
  });
});

describe('getModelName', () => {
  it('should return model name', () => {
    expect(repository.getModelName()).toBe('reservation');
  });
});

describe('list', () => {
  it('should return reservations', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const injected = repository.list.inject({
      prisma: { reservation: { findMany: mock } },
    });
    expect(await injected()).toEqual([{ id: 1 }]);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('count', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(3));
    const injected = repository.count.inject({
      prisma: { reservation: { count: mock } },
    });
    expect(await injected()).toBe(3);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('find', () => {
  it('should return reservation', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.find.inject({
      prisma: { reservation: { findFirst: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      rejectOnNotFound: true,
      where: { id: 123 },
    });
  });
});

describe('create', () => {
  it('should create reservation', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.create.inject({
      prisma: { reservation: { create: mock } },
    });
    expect(await injected({
      guestEmail: 'test@example.com',
      guestName: 'てすと',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'guest address',
      guestPhone: '090-0000-0000',
      roomName: 'room name',
      number: 2,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
    })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: {
        'amount': 10000,
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'code': expect.any(String),
        'guestAddress': 'ｇｕｅｓｔ　ａｄｄｒｅｓｓ',
        'guestEmail': 'test@example.com',
        'guestName': 'てすと',
        'guestNameKana': 'テスト',
        'guestPhone': '090-0000-0000',
        'guestZipCode': '100-0001',
        'number': 2,
        'roomName': 'room name',
      },
    });
  });
});

describe('update', () => {
  it('should update reservation', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.update.inject({
      prisma: { reservation: { update: mock } },
    });
    expect(await injected(123, { guestName: 'new name' })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: { guestName: 'new name' },
      where: { id: 123 },
    });
  });
});

describe('delete', () => {
  it('should delete reservation', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.delete.inject({
      prisma: { reservation: { delete: mock } },
    });
    expect(await injected(123)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({ where: { id: 123 } });
  });
});
