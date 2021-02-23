import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetStatusCalendarEventsUseCase } from '$/packages/application/usecase/admin/rooms/getStatusCalendarEvents';

export default defineController(() => ({
  get: async({
    query: { roomId, start, end },
  }) => container.resolve(GetStatusCalendarEventsUseCase).execute(roomId, start, end),
}));
