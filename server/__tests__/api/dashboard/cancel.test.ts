import controller from '$/api/dashboard/cancel/controller';
import { updateReservation } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { cancel } from '$/domains/dashboard';

describe('dashboard/cancel', () => {
  it('should cancel reservation', async() => {
    const updateMock         = jest.fn(() => getPromiseLikeItem({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'reserved',
      payment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      cancel: cancel.inject({
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      body: { id: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      guestId: 234,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'テスト県テスト市',
      guestPhone: '090-1234-5678',
      roomId: 345,
      roomName: 'test room',
      number: 10,
      amount: 10000,
      status: 'reserved',
    }));
    expect(updateMock).toBeCalledWith({
      data: {
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
  });
});
