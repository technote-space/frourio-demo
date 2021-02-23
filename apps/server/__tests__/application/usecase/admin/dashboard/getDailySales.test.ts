import { startOfMonth, endOfMonth, startOfDay } from 'date-fns';
import { GetDailySalesUseCase } from '$/application/usecase/admin/dashboard/getDailySales';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';

describe('GetDailySalesUseCase', () => {
  it('should get daily sales', async() => {
    expect(await (new GetDailySalesUseCase(
      new TestReservationRepository([
        getDummyReservationData(getDummyRoomData(), getDummyGuestData(), {
          checkin: new Date(),
          checkout: new Date(),
        }),
        getDummyReservationData(getDummyRoomData(), getDummyGuestData(), {
          payment: null,
          checkin: new Date(),
          checkout: new Date(),
        }),
      ]),
      new ResponseRepository(),
    )).execute(new Date())).toEqual({
      status: 200,
      body: expect.arrayContaining([
        {
          day: startOfMonth(new Date()),
          sales: expect.any(Number),
        },
        {
          day: startOfDay(endOfMonth(new Date())),
          sales: expect.any(Number),
        },
      ]),
    });
  });
});
