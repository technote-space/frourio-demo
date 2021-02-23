import { CheckoutReservationsUseCase } from '$/packages/application/usecase/stripe/checkoutReservations';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('CheckoutReservationsUseCase', () => {
  it('checkout reservations', async() => {
    const mock = jest.fn(() => getPromiseLikeItem({}));
    expect(await (new CheckoutReservationsUseCase(
      new TestReservationRepository([
        getDummyReservationData(await getRoom(), await getGuest(), { status: 'checkin' }),
        getDummyReservationData(await getRoom(), await getGuest(), { status: 'reserved' }),
        getDummyReservationData(await getRoom(), await getGuest(), { status: 'checkin' }),
      ]),
      new TestPaymentRepository(),
    )).execute.inject({
      sleep: mock,
    })());

    expect(mock).toBeCalledTimes(1);
  });
});
