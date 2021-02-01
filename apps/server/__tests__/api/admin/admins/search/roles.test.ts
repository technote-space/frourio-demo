import controller from '$/api/admin/admins/search/roles/controller';
import { getRoles, getRoleCount } from '$/repositories/role';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { searchRole } from '$/domains/admin/admins';

describe('reservations/search/roles', () => {
  it('should search roles', async() => {
    const getRolesMock = jest.fn(() => getPromiseLikeItem([
      {
        role: 'test',
        name: 'Test',
      },
      {
        role: 'test_create',
        name: 'Test create',
      },
    ]));
    const getRolesCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      searchRole: searchRole.inject({
        getRoles: getRoles.inject({
          prisma: {
            role: {
              findMany: getRolesMock,
            },
          },
        }),
        getRoleCount: getRoleCount.inject({
          prisma: {
            role: {
              count: getRolesCountMock,
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
        search: '',
        orderBy: {
          field: 'role',
        },
        orderDirection: 'asc',
      },
    });
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toEqual({
      role: 'test',
      name: 'Test',
    });
    expect(res.body.data[1]).toEqual({
      role: 'test_create',
      name: 'Test create',
    });
    expect(getRolesMock).toBeCalledWith({
      orderBy: {
        role: 'asc',
      },
      skip: 2,
      take: 2,
      where: undefined,
    });
    expect(getRolesCountMock).toBeCalledWith({
      where: undefined,
    });
  });
});
