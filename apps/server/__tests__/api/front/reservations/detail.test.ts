import controller from '$/api/front/reservations/_code@string/controller';
import { getReservation } from '$/repositories/reservation';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { getReservationDetail } from '$/domains/front/reservations';

describe('account/reservations/detail', () => {
  it('should get reservation detail', async() => {
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01'),
      checkout: new Date('2020-01-03'),
    }));
    const injectedController = controller.inject({
      getReservationDetail: getReservationDetail.inject({
        getReservation: getReservation.inject({
          prisma: { reservation: { findFirst: getReservationMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      params: { code: '6F4ZGO6ZE625' },
    });
    expect(res.body).toEqual({
      id: 123,
      checkin: new Date('2020-01-01'),
      checkout: new Date('2020-01-03'),
      nights: 2,
    });
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      include: {
        room: {
          select: {
            price: true,
          },
        },
      },
      where: {
        code: '6F4ZGO6ZE625',
      },
    });
  });
});
