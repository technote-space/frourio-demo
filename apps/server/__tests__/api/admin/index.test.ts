import controller from '$/api/admin/controller';
import { getAdmin } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get } from '$/domains/admin';

describe('admin', () => {
  it('should get admin', async() => {
    const injectedController = controller.inject({
      get: get.inject({
        getAdmin: getAdmin.inject({
          prisma: {
            admin: {
              findFirst: () => getPromiseLikeItem({
                id: 1,
                name: 'test name',
                email: 'test@example.com',
                password: 'test password',
                icon: 'dummy.svg',
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: getAuthorizationHeader(1), user: { id: 1, roles: [] } });
    expect(res.body).toEqual(expect.objectContaining({
      id: 1,
      name: 'test name',
      email: 'test@example.com',
      icon: 'http://localhost:8080/api/icons/dummy.svg',
    }));
    expect(res.body).not.toEqual(expect.objectContaining({
      password: 'test password',
    }));
  });

  it('should get admin without icon', async() => {
    const injectedController = controller.inject({
      get: get.inject({
        getAdmin: getAdmin.inject({
          prisma: {
            admin: {
              findFirst: () => getPromiseLikeItem({
                id: 1,
                name: 'test name',
                email: 'test@example.com',
                password: 'test password',
                icon: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: getAuthorizationHeader(1), user: { id: 1, roles: [] } });
    expect(res.body).toEqual(expect.objectContaining({
      id: 1,
      name: 'test name',
      email: 'test@example.com',
      icon: null,
    }));
    expect(res.body).not.toEqual(expect.objectContaining({
      password: 'test password',
    }));
  });
});
