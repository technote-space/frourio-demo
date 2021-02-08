import controller from '$/api/front/reservation/guest/controller';
import { getGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getGuestInfo } from '$/domains/front/reservation';

describe('reservation/guest', () => {
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

  it('should not get guest', async() => {
    const injectedController = controller.inject({
      getGuestInfo: getGuestInfo.inject({}),
    })(getFastify());

    const res = await injectedController.get({ headers: undefined, user: undefined });
    expect(res.body).toBeUndefined();
  });
});
