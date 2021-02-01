import controller from '$/api/front/account/guest/controller';
import { getGuest, updateGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getGuestInfo, updateGuestInfo } from '$/domains/front/account';

describe('account/guest', () => {
  it('should get guest', async() => {
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 1,
      email: 'test@example.com',
    }));
    const injectedController = controller.inject({
      getGuestInfo: getGuestInfo.inject({
        getGuest: getGuest.inject({
          prisma: { guest: { findFirst: getGuestMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: getAuthorizationHeader(1), user: { id: 1 } });
    expect(res.body).toEqual({
      id: 1,
      email: 'test@example.com',
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
  });

  it('should update guest', async() => {
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 1,
      email: 'test@example.com',
    }));
    const injectedController = controller.inject({
      updateGuestInfo: updateGuestInfo.inject({
        updateGuest: updateGuest.inject({
          prisma: { guest: { update: updateGuestMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1 },
      body: {
        email: 'test2@example.com',
        name: 'test2',
        nameKana: 'テスト',
        zipCode: '100-0002',
        address: 'テスト',
        phone: '03-0000-0000',
      },
    });
    expect(res.body).toEqual({
      id: 1,
      email: 'test@example.com',
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        email: 'test2@example.com',
        name: 'test2',
        nameKana: 'テスト',
        zipCode: '100-0002',
        address: 'テスト',
        phone: '03-0000-0000',
      },
      where: {
        id: 1,
      },
    });
  });
});
