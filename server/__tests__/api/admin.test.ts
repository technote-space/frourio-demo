import controller from '$/api/admin/controller';
import { getAdmin } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get } from '$/domains/admin';

test('dependency injection into controller', async() => {
  const injectedController = controller.inject({
    get: get.inject({
      getAdmin: getAdmin.inject({
        prisma: {
          admin: {
            findFirst: () => getPromiseLikeItem({
              id: 123,
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
  })(getFastify({ id: 123, roles: [] }));

  const res = await injectedController.get({});
  expect(res.body).toEqual(expect.objectContaining({
    id: 123,
    name: 'test name',
    email: 'test@example.com',
    password: 'test password',
  }));
});
