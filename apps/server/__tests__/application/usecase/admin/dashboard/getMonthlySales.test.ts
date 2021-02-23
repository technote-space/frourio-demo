import { startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { GetMonthlySalesUseCase } from '$/application/usecase/admin/dashboard/getMonthlySales';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';

describe('GetMonthlySalesUseCase', () => {
  it('should get monthly sales', async() => {
    expect(await (new GetMonthlySalesUseCase(
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
          month: startOfYear(new Date()),
          sales: expect.any(Number),
        },
        {
          month: startOfMonth(endOfYear(new Date())),
          sales: expect.any(Number),
        },
      ]),
    });
  });
});
