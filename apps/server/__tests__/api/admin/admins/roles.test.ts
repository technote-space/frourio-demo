import controller from '$/api/admin/admins/roles/controller';
import { getRoles } from '$/repositories/role';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { listRoles } from '$/domains/admin/admins';

describe('admins/roles', () => {
  it('should get roles', async() => {
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
    const injectedController = controller.inject({
      listRoles: listRoles.inject({
        getRoles: getRoles.inject({
          prisma: {
            role: {
              findMany: getRolesMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
    });
    expect(res.body).toEqual({
      'test': 'Test',
      'test_create': 'Test create',
    });
    expect(getRolesMock).toBeCalledTimes(1);
  });
});
