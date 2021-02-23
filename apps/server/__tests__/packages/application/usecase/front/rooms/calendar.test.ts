import { CalendarUseCase } from '$/packages/application/usecase/front/rooms/calendar';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/packages/infra/http/response';
import { format, addDays } from 'date-fns';

describe('CalendarUseCase', () => {
  it('should cancel reservation', async() => {
    const roomRepository = new TestRoomRepository([getDummyRoomData()]);
    expect(await (new CalendarUseCase(
      new TestReservationRepository([
        getDummyReservationData(await roomRepository.find(1), getDummyGuestData(), {
          checkin: addDays(new Date(), 0),
          checkout: addDays(new Date(), 1),
        }),
        getDummyReservationData(await roomRepository.find(1), getDummyGuestData(), {
          checkin: addDays(new Date(), 1),
          checkout: addDays(new Date(), 2),
        }),
        getDummyReservationData(await roomRepository.find(1), getDummyGuestData(), {
          checkin: addDays(new Date(), 10),
          checkout: addDays(new Date(), 20),
        }),
      ]),
      new ResponseRepository(),
    )).execute(1, new Date(), new Date())).toEqual({
      status: 200,
      body: expect.arrayContaining([{
        start: format(addDays(new Date(), 0), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'background',
      }]),
    });
  });

  it('should cancel reservation', async() => {
    expect(await (new CalendarUseCase(
      new TestReservationRepository([]),
      new ResponseRepository(),
    )).execute(1, new Date(), new Date())).toEqual({
      status: 200,
      body: expect.arrayContaining([]),
    });
  });
});
