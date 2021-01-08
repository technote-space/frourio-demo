import { defineController } from './$relay';
import { getCheckinNotSelectable } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query: { roomId, start, end, id } }) => getCheckinNotSelectable(roomId, start, end, id),
}));