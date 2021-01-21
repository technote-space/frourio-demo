import controller from '$/api/admins/_adminId@number/controller';
import { getAdmin, updateAdmin, deleteAdmin } from '$/repositories/admin';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get, update, remove } from '$/domains/admins';

describe('admins/detail', () => {
  it('should get admin', async() => {
    const getAdminMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      name: 'test',
      email: 'test1@example.com',
      icon: null,
      roles: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      get: get.inject({
        getAdmin: getAdmin.inject({
          prisma: {
            admin: {
              findFirst: getAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { adminId: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      name: 'test',
      email: 'test1@example.com',
      icon: null,
      roles: [],
    }));
    expect(getAdminMock).toBeCalledWith({
      include: {
        roles: true,
      },
      where: {
        id: 123,
      },
    });
  });

  it('should update admin', async() => {
    const updateAdminMock = jest.fn(() => getPromiseLikeItem({}));
    const injectedController = controller.inject({
      update: update.inject({
        updateAdmin: updateAdmin.inject({
          prisma: {
            admin: {
              update: updateAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { adminId: 123 },
      body: {
        name: 'test',
        email: 'test1@example.com',
        password: 'test1234',
        roles: [],
      },
    });
    expect(res.status).toBe(200);
    expect(updateAdminMock).toBeCalledWith(expect.objectContaining({
      data: {
        name: 'test',
        email: 'test1@example.com',
        password: expect.any(String),
        roles: { connect: [] },
      },
      where: {
        id: 123,
      },
    }));
  });

  it('should delete admin', async() => {
    const deleteAdminMock = jest.fn(() => getPromiseLikeItem({}));
    const injectedController = controller.inject({
      remove: remove.inject({
        deleteAdmin: deleteAdmin.inject({
          prisma: {
            admin: {
              delete: deleteAdminMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { adminId: 123 },
    });
    expect(res.status).toBe(200);
    expect(deleteAdminMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });
});
