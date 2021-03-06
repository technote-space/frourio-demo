import { GetCheckoutSelectableUseCase } from '$/packages/application/usecase/front/reservation/getCheckoutSelectable';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';
import { format, addDays, addMonths, startOfDay } from 'date-fns';

describe('GetCheckoutSelectableUseCase', () => {
  it('should get checkout selectable events', async() => {
    expect(await (new GetCheckoutSelectableUseCase(
      new TestReservationRepository([
        getDummyReservationData(getDummyRoomData(), getDummyGuestData(), {
          checkin: new Date(),
          checkout: addDays(new Date(), 1),
        }),
        getDummyReservationData(getDummyRoomData(), getDummyGuestData(), {
          checkin: addDays(new Date(), 1),
          checkout: addDays(new Date(), 2),
        }),
        getDummyReservationData(getDummyRoomData(), getDummyGuestData(), {
          checkin: addDays(new Date(), 10),
          checkout: addDays(new Date(), 20),
        }),
      ]),
      new ResponseRepository(),
    )).execute(1, startOfDay(addMonths(new Date(), 1)), new Date())).toEqual({
      status: 200,
      body: expect.arrayContaining([{
        start: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'inverse-background',
      }]),
    });
  });

  it('should get checkout selectable events', async() => {
    expect(await (new GetCheckoutSelectableUseCase(
      new TestReservationRepository([]),
      new ResponseRepository(),
    )).execute(1, startOfDay(addMonths(new Date(), 1)), new Date(), { id: 1 })).toEqual({
      status: 200,
      body: [{
        start: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        end: format(startOfDay(addMonths(new Date(), 1)), 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'inverse-background',
      }],
    });
  });
});
