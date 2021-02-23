import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetStatusCalendarEventsUseCase } from '$/application/usecase/admin/rooms/getStatusCalendarEvents';

export default defineController(() => ({
  get: async({
    query: { roomId, start, end },
  }) => container.resolve(GetStatusCalendarEventsUseCase).execute(roomId, start, end),
}));
