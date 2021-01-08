import { defineController } from './$relay';
import { getCheckinNotSelectable } from '$/domains/reservations';

export default defineController(({ getCheckinNotSelectable }), ({ getCheckinNotSelectable }) => ({
  get: async({ query: { roomId, start, end, id } }) => getCheckinNotSelectable(roomId, start, end, id),
}));
