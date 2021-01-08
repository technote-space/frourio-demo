import controller from '$/api/guests/_guestId@number/controller';
import { getGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get, update, remove } from '$/domains/guests';

describe('guests/detail', () => {
  it('should get guest', async() => {
    const getGuestMock       = jest.fn(() => getPromiseLikeItem({
      id: 123,
      name: 'test',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市',
      phone: '090-1234-5678',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      get: get.inject({
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { guestId: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      name: 'test',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市',
      phone: '090-1234-5678',
    }));
    expect(getGuestMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });

  it('should update guest', async() => {
    const updateGuestMock    = jest.fn();
    const injectedController = controller.inject({
      update: update.inject({
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { guestId: 123 },
      body: {
        name: 'test',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '090-1234-5678',
      },
    });
    expect(res.status).toBe(200);
    expect(updateGuestMock).toBeCalledWith({
      data: {
        name: 'test',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '090-1234-5678',
      },
      where: {
        id: 123,
      },
    });
  });

  it('should delete guest', async() => {
    const deleteGuestMock    = jest.fn();
    const injectedController = controller.inject({
      remove: remove.inject({
        deleteGuest: deleteGuest.inject({
          prisma: {
            guest: {
              delete: deleteGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { guestId: 123 },
    });
    expect(res.status).toBe(200);
    expect(deleteGuestMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });
});
