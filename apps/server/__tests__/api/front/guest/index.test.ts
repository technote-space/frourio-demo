import controller from '$/api/front/guest/controller';
import { getGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get } from '$/domains/front/guest';

describe('guest', () => {
  it('should get guest', async() => {
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 1,
      email: 'test@example.com',
    }));
    const injectedController = controller.inject({
      get: get.inject({
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
});
