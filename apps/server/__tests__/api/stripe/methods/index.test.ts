import controller from '$/api/stripe/methods/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getPaymentMethods } from '$/domains/stripe';
import { getGuest } from '$/repositories/guest';

describe('reservation/stripe/methods', () => {
  it('should return payment methods', async() => {
    const paymentMethodsListMock = jest.fn(() => getPromiseLikeItem({
      data: [
        { id: '1' },
        { id: '2' },
      ],
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: 'stripe' }));
    const injectedController = controller.inject({
      getPaymentMethods: getPaymentMethods.inject({
        stripe: {
          paymentMethods: {
            list: paymentMethodsListMock,
          },
        },
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual([{ id: '1' }, { id: '2' }]);
    expect(paymentMethodsListMock).toBeCalledWith({
      customer: 'stripe',
      type: 'card',
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should return empty array (stripe customer is not set)', async() => {
    const getGuestMock = jest.fn(() => getPromiseLikeItem({ stripe: null }));
    const injectedController = controller.inject({
      getPaymentMethods: getPaymentMethods.inject({
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({ headers: { authorization: '' }, user: { id: 123 } });
    expect(res.body).toEqual([]);
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });
});
