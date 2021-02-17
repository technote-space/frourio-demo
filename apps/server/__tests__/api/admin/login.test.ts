import controller from '$/api/admin/login/controller';
import { createAdminAuthorizationPayload } from '$/service/auth';
import { getAdmin, validateUser } from '$/repositories/admin';
import { createHash } from '$/repositories/utils';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { login } from '$/domains/admin/login';

describe('login', () => {
  it('should login', async() => {
    const getAdminMock = jest.fn(() => getPromiseLikeItem({
      id: 1,
      name: 'test name',
      email: 'test@example.com',
      password: createHash('test1234'),
      icon: 'dummy.svg',
      roles: [{ role: 'test1' }, { role: 'test2' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      login: login.inject({
        createAdminAuthorizationPayload: createAdminAuthorizationPayload.inject({
          getAdmin: getAdmin.inject({
            prisma: {
              admin: {
                findFirst: getAdminMock,
              },
            },
          }),
        }),
        validateUser: validateUser.inject({
          prisma: {
            admin: {
              findFirst: getAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      user: { id: 1, roles: [] },
      body: {
        email: 'test@example.com',
        pass: 'test1234',
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers).toEqual({ authorization: JSON.stringify({ id: 1, roles: ['test1', 'test2'] }) });
  });

  it('should fail login', async() => {
    const getAdminMock = jest.fn(() => getPromiseLikeItem({
      id: 1,
      name: 'test name',
      email: 'test@example.com',
      password: createHash('test1234'),
      icon: 'dummy.svg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      login: login.inject({
        createAdminAuthorizationPayload: createAdminAuthorizationPayload.inject({
          getAdmin: getAdmin.inject({
            prisma: {
              admin: {
                findFirst: getAdminMock,
              },
            },
          }),
        }),
        validateUser: validateUser.inject({
          prisma: {
            admin: {
              findFirst: getAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      user: { id: 1, roles: [] },
      body: {
        email: 'test@example.com',
        pass: 'wrong pass',
      },
    });
    expect(res.status).toBe(401);
  });
});
