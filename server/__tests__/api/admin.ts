import controller from '$/api/admin/controller';
import { getAdmin, getAdminId } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/utils/test-helper';
import { get } from '$/domains/admin';

test('dependency injection into controller', async() => {
  const injectedGetAdmin   = getAdmin.inject({
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
  });
  const injectedController = controller.inject({
    get: get.inject({
      getAdmin: injectedGetAdmin,
      getAdminId: getAdminId.inject({
        getAdmin: injectedGetAdmin,
      }),
    }),
  })(getFastify());

  const res = await injectedController.get({ headers: getAuthorizationHeader(123) });
  expect(res.body).toEqual(expect.objectContaining({
    id: 123,
    name: 'test name',
    email: 'test@example.com',
    password: 'test password',
  }));
});
