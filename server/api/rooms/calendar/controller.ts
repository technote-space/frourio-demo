import { defineController } from './$relay';
import { getStatusCalendarEvents } from '$/domains/rooms';

export default defineController(() => ({
  get: async({ query: { roomId, start, end } }) => getStatusCalendarEvents(roomId, start, end),
}));
