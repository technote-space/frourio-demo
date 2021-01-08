import controller from '$/api/reservations/guest/controller';
import { getGuest } from '$/repositories/guest';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { getSelectedGuest } from '$/domains/reservations';

describe('reservations/guest', () => {
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
      getSelectedGuest: getSelectedGuest.inject({
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
      query: { guestId: 123 },
    });
    expect(res.body).toEqual({
      id: 123,
      name: 'test',
    });
    expect(getGuestMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });
});
