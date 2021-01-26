import { defineController } from './$relay';
import { getStatusCalendarEvents } from '$/domains/admin/rooms';

export default defineController(({ getStatusCalendarEvents }), ({ getStatusCalendarEvents }) => ({
  get: async({ query: { roomId, start, end } }) => getStatusCalendarEvents(roomId, start, end),
}));
