import { RoleRepository } from '$/infra/database/role';
import { getPromiseLikeItem } from '$/__tests__/utils';

const repository = new RoleRepository();

describe('list', () => {
  it('should return roles', async() => {
    const mock = jest.fn(() => getPromiseLikeItem([{ id: 1 }]));
    const injected = repository.list.inject({
      prisma: { role: { findMany: mock } },
    });
    expect(await injected()).toEqual([{ id: 1 }]);
    expect(mock).toBeCalledWith(undefined);
  });
});

describe('count', () => {
  it('should return number', async() => {
    const mock = jest.fn(() => getPromiseLikeItem(3));
    const injected = repository.count.inject({
      prisma: { role: { count: mock } },
    });
    expect(await injected()).toBe(3);
    expect(mock).toBeCalledWith(undefined);
  });
});
