import controller from '$/api/admin/dashboard/cancel/controller';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { cancel } from '$/domains/admin/dashboard';
import { cancelPaymentIntents } from '$/domains/stripe';
import { cancelStripePaymentIntents } from '$/repositories/stripe';

describe('dashboard/cancel', () => {
  it('should cancel reservation', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      paymentIntents: 'pi_test',
    }));
    const updateMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      code: '6F4ZGO6ZE625',
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
    const paymentIntentsCancelMock = jest.fn();
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        cancelPaymentIntents: cancelPaymentIntents.inject({
          cancelStripePaymentIntents: cancelStripePaymentIntents.inject({
            stripe: {
              paymentIntents: {
                cancel: paymentIntentsCancelMock,
              },
            },
          }),
          updateReservation: updateReservation.inject({
            prisma: {
              reservation: {
                update: updateMock,
              },
            },
          }),
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
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: false,
      where: {
        id: 123,
        status: {
          not: 'cancelled',
        },
      },
    });
    expect(updateMock).toBeCalledWith({
      data: {
        status: 'cancelled',
      },
      where: {
        id: 123,
      },
    });
    expect(paymentIntentsCancelMock).toBeCalledWith('pi_test');
  });

  it('should not cancel reservation', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem(null));
    const injectedController = controller.inject({
      cancel: cancel.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
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
    expect(res.status).toBe(400);
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: false,
      where: {
        id: 123,
        status: {
          not: 'cancelled',
        },
      },
    });
  });
});
