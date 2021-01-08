import controller from '$/api/login/controller';
import { createAuthorizationPayload, createHash } from '$/service/auth';
import { getAdmin, validateUser } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { login } from '$/domains/login';

describe('login', () => {
  it('should login', async() => {
    const getAdminMock       = jest.fn(() => getPromiseLikeItem({
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
        createAuthorizationPayload: createAuthorizationPayload.inject({
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
  });

  it('should fail login', async() => {
    const getAdminMock       = jest.fn(() => getPromiseLikeItem({
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
        createAuthorizationPayload: createAuthorizationPayload.inject({
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
