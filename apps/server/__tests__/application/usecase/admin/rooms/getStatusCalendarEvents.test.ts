import { GetStatusCalendarEventsUseCase } from '$/application/usecase/admin/rooms/getStatusCalendarEvents';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';

describe('GetStatusCalendarEventsUseCase', () => {
  it('should get status calendar events', async() => {
    expect(await (new GetStatusCalendarEventsUseCase(new TestReservationRepository([
      getDummyReservationData(await getRoom(), await getGuest()),
    ]), new ResponseRepository())).execute(1, new Date(), new Date())).toEqual({
      status: 200,
      body: [{
        title: expect.any(String),
        start: expect.any(String),
        end: expect.any(String),
        allDay: true,
        displayEventTime: false,
        startEditable: false,
        durationEditable: false,
        resourceEditable: false,
      }],
    });
  });
});
