import type { Reservation } from '$/domain/database/reservation';
import { RoomKeyRepository } from '$/infra/database/roomKey';
import { getPromiseLikeItem } from '$/__tests__/utils';

const repository = new RoomKeyRepository();

describe('find', () => {
  it('should return roomKey', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.find.inject({
      prisma: { roomKey: { findFirst: mock } },
    });
    expect(await injected(111)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      where: {
        reservationId: 111,
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
      },
    });
  });
});

describe('create', () => {
  it('should create roomKey', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.create.inject({
      prisma: { roomKey: { create: mock } },
    });
    expect(await injected({
      id: 111,
      checkin: new Date(),
      checkout: new Date(),
    } as Reservation)).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: {
        reservation: {
          connect: {
            id: 111,
          },
        },
        key: expect.any(String),
        trials: 0,
        startAt: expect.any(Date),
        endAt: expect.any(Date),
      },
    });
  });
});

describe('update', () => {
  it('should update roomKey', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injected = repository.update.inject({
      prisma: { roomKey: { update: mock } },
    });
    expect(await injected(123, { trials: 0 })).toEqual({ id: 123 });
    expect(mock).toBeCalledWith({
      data: { trials: 0 },
      where: { id: 123 },
    });
  });
});
