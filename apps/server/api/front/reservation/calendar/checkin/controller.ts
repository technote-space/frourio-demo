import { defineController } from './$relay';
import { getCheckinNotSelectable } from '$/domains/front/reservation';

export default defineController(({ getCheckinNotSelectable }), ({ getCheckinNotSelectable }) => ({
  get: async({ query: { roomId, start, end }, user }) => getCheckinNotSelectable(roomId, start, end, user),
}));
