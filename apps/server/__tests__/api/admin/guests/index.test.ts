import controller from '$/api/admin/guests/controller';
import { getGuestCount, getGuests, createGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { list, create } from '$/domains/admin/guests';

describe('guests', () => {
  it('should get guests', async() => {
    const getGuestsMock      = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        name: 'test12',
        nameKana: 'テスト1',
        zipCode: '100-0001',
        address: 'テスト県テスト市1',
        phone: '090-1234-5678',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        name: 'test22',
        nameKana: 'テスト2',
        zipCode: '100-0002',
        address: 'テスト県テスト市2',
        phone: '090-2234-5678',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const getGuestsCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      list: list.inject({
        getGuests: getGuests.inject({
          prisma: {
            guest: {
              findMany: getGuestsMock,
            },
          },
        }),
        getGuestCount: getGuestCount.inject({
          prisma: {
            guest: {
              count: getGuestsCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        filters: [],
        page: 0,
        pageSize: 2,
        totalCount: 100,
        search: 'test name',
        orderBy: {},
        orderDirection: 'desc',
      },
    });
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toEqual(expect.objectContaining({
      id: 123,
    }));
    expect(res.body.data[1]).toEqual(expect.objectContaining({
      id: 234,
    }));
    const where = {
      AND: [
        {
          OR: [
            {
              email: {
                contains: 'test',
              },
            },
            {
              name: {
                contains: 'test',
              },
            },
            {
              nameKana: {
                contains: 'test',
              },
            },
            {
              zipCode: {
                contains: 'test',
              },
            },
            {
              address: {
                contains: 'test',
              },
            },
            {
              phone: {
                contains: 'test',
              },
            },
          ],
        },
        {
          OR: [
            {
              email: {
                contains: 'name',
              },
            },
            {
              name: {
                contains: 'name',
              },
            },
            {
              nameKana: {
                contains: 'name',
              },
            },
            {
              zipCode: {
                contains: 'name',
              },
            },
            {
              address: {
                contains: 'name',
              },
            },
            {
              phone: {
                contains: 'name',
              },
            },
          ],
        },
      ],
    };
    expect(getGuestsMock).toBeCalledWith({
      orderBy: undefined,
      skip: 0,
      take: 2,
      where,
    });
    expect(getGuestsCountMock).toBeCalledWith({
      where,
    });
  });

  it('should create guest', async() => {
    const createGuestMock    = jest.fn();
    const injectedController = controller.inject({
      create: create.inject({
        createGuest: createGuest.inject({
          prisma: {
            guest: {
              create: createGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: {
        email: 'test@example.com',
        name: 'test name',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '090-1234-5678',
      },
    });
    expect(res.status).toBe(201);
    expect(createGuestMock).toBeCalledWith({
      data: {
        email: 'test@example.com',
        name: 'test name',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '090-1234-5678',
      },
    });
  });
});
