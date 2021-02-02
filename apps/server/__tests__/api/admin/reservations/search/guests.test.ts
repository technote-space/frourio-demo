import controller from '$/api/admin/reservations/search/guests/controller';
import { getGuests, getGuestCount } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { searchGuest } from '$/domains/admin/reservations';

describe('reservations/search/guests', () => {
  it('should search guests', async() => {
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
    const getGuestsCountMock = jest.fn(() => getPromiseLikeItem(0));
    const injectedController = controller.inject({
      searchGuest: searchGuest.inject({
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
        page: 10,
        pageSize: 2,
        totalCount: 100,
        search: '  ',
        orderBy: {
          field: 'name',
        },
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
    expect(getGuestsMock).toBeCalledWith({
      select: {
        id: true,
        email: true,
        name: true,
        nameKana: true,
        zipCode: true,
        address: true,
        phone: true,
        reservations: {
          take: 3,
          orderBy: {
            checkin: 'desc',
          },
        },
      },
      orderBy: {
        name: 'desc',
      },
      skip: 0,
      take: 2,
      where: undefined,
    });
    expect(getGuestsCountMock).toBeCalledWith({
      where: undefined,
    });
  });
});
