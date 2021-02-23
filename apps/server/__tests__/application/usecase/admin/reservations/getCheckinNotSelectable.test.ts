import { GetCheckinNotSelectableUseCase } from '$/application/usecase/admin/reservations/getCheckinNotSelectable';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { ResponseRepository } from '$/infra/http/response';
import { format, addDays } from 'date-fns';

describe('GetCheckinNotSelectableUseCase', () => {
  it('should get checkin not selectable events', async() => {
    const room = await getRoom();
    const guest = await getGuest();
    expect(await (new GetCheckinNotSelectableUseCase(
      new TestReservationRepository([
        getDummyReservationData(room, guest, {
          checkin: new Date(),
          checkout: addDays(new Date(), 1),
        }),
        getDummyReservationData(room, guest, {
          checkin: addDays(new Date(), 1),
          checkout: addDays(new Date(), 2),
        }),
        getDummyReservationData(room, guest, {
          checkin: addDays(new Date(), 10),
          checkout: addDays(new Date(), 20),
        }),
      ]),
      new ResponseRepository(),
    )).execute(1, new Date(), new Date())).toEqual({
      status: 200,
      body: expect.arrayContaining([{
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'background',
      }]),
    });
  });

  it('should get checkin not selectable events', async() => {
    expect(await (new GetCheckinNotSelectableUseCase(
      new TestReservationRepository([]),
      new ResponseRepository(),
    )).execute(1, new Date(), new Date(), 1)).toEqual({
      status: 200,
      body: [],
    });
  });
});
