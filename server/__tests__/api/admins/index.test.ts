import controller from '$/api/admins/controller';
import { getAdminCount, getAdmins, createAdmin } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { list, create } from '$/domains/admins';

describe('admins', () => {
  it('should get admins', async() => {
    const getAdminsMock = jest.fn(() => getPromiseLikeItem([
      {
        id: 123,
        name: 'test12',
        email: 'test1@example.com',
        icon: null,
        roles: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 234,
        name: 'test22',
        email: 'test2@example.com',
        icon: 'test.png',
        roles: 'rooms|rooms_create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]));
    const getAdminsCountMock = jest.fn(() => getPromiseLikeItem(3));
    const injectedController = controller.inject({
      list: list.inject({
        getAdmins: getAdmins.inject({
          prisma: {
            admin: {
              findMany: getAdminsMock,
            },
          },
        }),
        getAdminCount: getAdminCount.inject({
          prisma: {
            admin: {
              count: getAdminsCountMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      query: {
        filters: [{
          column: {
            field: 'roles',
          },
          value: ['dashboard', 'rooms'],
          operator: '=',
        }],
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
              name: {
                contains: 'test',
              },
            },
            {
              email: {
                contains: 'test',
              },
            },
          ],
        },
        {
          OR: [
            {
              name: {
                contains: 'name',
              },
            },
            {
              email: {
                contains: 'name',
              },
            },
          ],
        },
        {
          roles: {
            some: {
              role: {
                in: ['dashboard', 'rooms'],
              },
            },
          },
        },
      ],
    };
    expect(getAdminsMock).toBeCalledWith({
      include: {
        roles: true,
      },
      orderBy: undefined,
      skip: 0,
      take: 2,
      where,
    });
    expect(getAdminsCountMock).toBeCalledWith({
      where,
    });
  });

  it('should create admin', async() => {
    const createAdminMock = jest.fn(() => getPromiseLikeItem({}));
    const injectedController = controller.inject({
      create: create.inject({
        createAdmin: createAdmin.inject({
          prisma: {
            admin: {
              create: createAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: {
        name: 'test name',
        email: 'test1@example.com',
        password: 'test1234',
        roles: [{ role: 'rooms', name: 'rooms' }, { role: 'rooms_create', name: 'rooms create' }],
      },
    });
    expect(res.status).toBe(201);
    expect(createAdminMock).toBeCalledWith(expect.objectContaining({
      data: {
        name: 'test name',
        email: 'test1@example.com',
        password: expect.any(String),
        roles: {
          connect: [
            { role: 'rooms' },
            { role: 'rooms_create' },
          ],
        },
      },
    }));
  });
});
