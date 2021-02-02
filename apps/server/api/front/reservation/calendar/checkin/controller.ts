import { defineController } from './$relay';
import { getCheckinNotSelectable } from '$/domains/front/reservation';

export default defineController(({ getCheckinNotSelectable }), ({ getCheckinNotSelectable }) => ({
  get: async({ query: { roomId, start, end } }) => getCheckinNotSelectable(roomId, start, end),
}));
